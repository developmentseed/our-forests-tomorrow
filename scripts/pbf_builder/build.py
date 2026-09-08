#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
import urllib.request
import zipfile
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import numpy as np
import rasterio
import yaml


SCRIPT_DIR = Path(__file__).resolve().parent
ROOT = SCRIPT_DIR.parents[1]
CONFIG_PATH = SCRIPT_DIR / "config.yaml"

DATA = ROOT / "data" / "pbf_builder"
RAW = DATA / "raw"
EXTRACTED = DATA / "extracted"
GEOJSON = DATA / "geojson"

PBF = ROOT / "public" / "pbf"

ZIP_PATH = RAW / "EU-Trees4F_ens-sdms.zip"

SUPPORTED_SCENARIOS = ("rcp45", "rcp85")


def load_config():
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def ensure_directories():
    for directory in [RAW, EXTRACTED, GEOJSON, PBF]:
        directory.mkdir(parents=True, exist_ok=True)


def validate_scenario(scenario: str):
    scenario = scenario.lower()

    if scenario not in SUPPORTED_SCENARIOS:
        raise ValueError(
            f"Unsupported scenario '{scenario}'. "
            f"Expected one of: {', '.join(SUPPORTED_SCENARIOS)}"
        )

    return scenario


def download_dataset(url: str):
    if ZIP_PATH.exists():
        print(f"[download] Archive already exists: {ZIP_PATH}")
        return

    print("[download] Downloading:")
    print(f"           {url}")
    print(f"           -> {ZIP_PATH}")

    tmp = ZIP_PATH.with_suffix(".tmp")

    try:
        urllib.request.urlretrieve(url, tmp)
        tmp.replace(ZIP_PATH)
    except Exception:
        if tmp.exists():
            tmp.unlink()
        raise

    print("[download] Done")


def extract_dataset():
    marker = EXTRACTED / ".extracted"

    if marker.exists():
        print("[extract] Dataset already extracted")
        return

    print(f"[extract] Extracting {ZIP_PATH}")

    with zipfile.ZipFile(ZIP_PATH, "r") as z:
        z.extractall(EXTRACTED)

    marker.touch()

    print("[extract] Done")


def all_tifs():
    return list(EXTRACTED.rglob("*.tif")) + list(
        EXTRACTED.rglob("*.tiff")
    )


def normalise_name(path: Path) -> str:
    return path.name.lower()


def find_species_files(species: str, scenario: str):
    """
    Find the current baseline and future potential suitability
    probability rasters for a species and climate scenario.

    The current 2005 raster is shared between scenarios.
    Future rasters are scenario-specific.
    """

    scenario = validate_scenario(scenario)

    files = all_tifs()
    prefix = f"{species}_ens-sdms_"

    matching = [
        p
        for p in files
        if p.name.startswith(prefix)
    ]

    if not matching:
        raise FileNotFoundError(
            f"No TIF found for species '{species}'"
        )

    def find_exact(suffix: str):
        matches = [
            p
            for p in matching
            if p.name.endswith(suffix)
        ]

        if not matches:
            raise FileNotFoundError(
                f"Missing raster for '{species}': *{suffix}"
            )

        if len(matches) > 1:
            print(
                f"[warning] Multiple rasters found for "
                f"'{species}' matching '*{suffix}':"
            )

            for match in matches:
                print(f"           {match}")

        return matches[0]

    return {
        "current": find_exact(
            "cur2005_prob_pot.tif"
        ),
        "fut1": find_exact(
            f"{scenario}_fut2035_prob_pot.tif"
        ),
        "fut2": find_exact(
            f"{scenario}_fut2065_prob_pot.tif"
        ),
        "fut3": find_exact(
            f"{scenario}_fut2095_prob_pot.tif"
        ),
    }


def discover_species():
    """
    Extract species names from filenames.

    Expected examples:
      Abies_alba_ens-sdms_cur_bin_nat.tif
      Abies_alba_ens-sdms_rcp45_fut2035_prob_pot.tif
      Abies_alba_ens-sdms_rcp85_fut2035_prob_pot.tif
    """

    species = set()

    pattern = re.compile(
        r"^(?P<species>.+?)_ens-sdms_"
        r"(?:cur|rcp45|rcp85)_",
        re.IGNORECASE,
    )

    for tif in all_tifs():
        match = pattern.match(tif.stem)

        if match:
            species.add(
                match.group("species")
            )

    return sorted(species)


def read_raster_info(path: Path):
    with rasterio.open(path) as src:
        return {
            "width": src.width,
            "height": src.height,
            "crs": src.crs,
            "transform": src.transform,
            "nodata": src.nodata,
            "bounds": src.bounds,
        }


def check_rasters(paths):
    """
    Validate that all rasters use the same CRS and pixel resolution.

    Raster dimensions and origins are allowed to differ because the
    current and future rasters may have slightly different extents.
    """

    infos = {
        key: read_raster_info(path)
        for key, path in paths.items()
    }

    reference = infos["current"]

    for key, info in infos.items():
        if info["crs"] != reference["crs"]:
            raise ValueError(
                f"{key}: CRS differs from current"
            )

        if not np.allclose(
            info["transform"].a,
            reference["transform"].a,
        ):
            raise ValueError(
                f"{key}: pixel width differs from current"
            )

        if not np.allclose(
            abs(info["transform"].e),
            abs(reference["transform"].e),
        ):
            raise ValueError(
                f"{key}: pixel height differs from current"
            )

    return infos


def iter_pixels(paths, chunk_size):
    """
    Read the common spatial grid shared by the current and future rasters.

    The future rasters are used as the reference grid. The current raster
    is cropped to the same spatial extent without interpolation.
    """

    with (
        rasterio.open(paths["current"]) as src_current,
        rasterio.open(paths["fut1"]) as src_fut1,
        rasterio.open(paths["fut2"]) as src_fut2,
        rasterio.open(paths["fut3"]) as src_fut3,
    ):
        width = src_fut1.width
        height = src_fut1.height

        transform = src_fut1.transform

        current_window = rasterio.windows.from_bounds(
            *src_fut1.bounds,
            transform=src_current.transform,
        ).round_offsets().round_lengths()

        rows_per_chunk = max(
            1,
            chunk_size // width,
        )

        for row_start in range(
            0,
            height,
            rows_per_chunk,
        ):
            row_height = min(
                rows_per_chunk,
                height - row_start,
            )

            future_window = rasterio.windows.Window(
                0,
                row_start,
                width,
                row_height,
            )

            current_window_chunk = rasterio.windows.Window(
                current_window.col_off,
                current_window.row_off + row_start,
                width,
                row_height,
            )

            current = src_current.read(
                1,
                window=current_window_chunk,
            )

            fut1 = src_fut1.read(
                1,
                window=future_window,
            )

            fut2 = src_fut2.read(
                1,
                window=future_window,
            )

            fut3 = src_fut3.read(
                1,
                window=future_window,
            )

            rows = np.arange(
                row_start,
                row_start + row_height,
                dtype=np.float64,
            )

            cols = np.arange(
                0,
                width,
                dtype=np.float64,
            )

            cols_grid, rows_grid = np.meshgrid(
                cols,
                rows,
            )

            xs, ys = rasterio.transform.xy(
                transform,
                rows_grid,
                cols_grid,
                offset="center",
            )

            xs = np.asarray(xs).ravel()
            ys = np.asarray(ys).ravel()

            current = current.astype(
                np.float32
            ).ravel()

            fut1 = fut1.astype(
                np.float32
            ).ravel()

            fut2 = fut2.astype(
                np.float32
            ).ravel()

            fut3 = fut3.astype(
                np.float32
            ).ravel()

            mask = (
                np.isfinite(current)
                & np.isfinite(fut1)
                & np.isfinite(fut2)
                & np.isfinite(fut3)
            )

            mask &= (
                (current >= 0)
                & (current <= 1000)
                & (fut1 >= 0)
                & (fut1 <= 1000)
                & (fut2 >= 0)
                & (fut2 <= 1000)
                & (fut3 >= 0)
                & (fut3 <= 1000)
            )

            yield (
                xs[mask],
                ys[mask],
                current[mask],
                fut1[mask],
                fut2[mask],
                fut3[mask],
                transform,
            )


def feature_generator(
    species: str,
    paths,
    chunk_size,
):
    for (
        xs,
        ys,
        current,
        fut1,
        fut2,
        fut3,
        transform,
    ) in iter_pixels(
        paths,
        chunk_size,
    ):
        cell_width = abs(transform.a)
        cell_height = abs(transform.e)

        half_width = cell_width / 2
        half_height = cell_height / 2

        for i in range(len(xs)):
            x = float(xs[i])
            y = float(ys[i])

            yield {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [
                            x - half_width,
                            y - half_height,
                        ],
                        [
                            x + half_width,
                            y - half_height,
                        ],
                        [
                            x + half_width,
                            y + half_height,
                        ],
                        [
                            x - half_width,
                            y + half_height,
                        ],
                        [
                            x - half_width,
                            y - half_height,
                        ],
                    ]],
                },
                "properties": {
                    "species": species,
                    "current": int(current[i]),
                    "fut1": int(fut1[i]),
                    "fut2": int(fut2[i]),
                    "fut3": int(fut3[i]),
                },
            }


def write_geojson(
    species: str,
    scenario: str,
    paths,
    chunk_size,
):
    scenario = validate_scenario(scenario)

    scenario_dir = GEOJSON / scenario
    scenario_dir.mkdir(
        parents=True,
        exist_ok=True,
    )

    output = (
        scenario_dir
        / f"{species}.geojson"
    )

    print(
        f"[geojson] {scenario} / {species}"
    )

    with open(
        output,
        "w",
        encoding="utf-8",
    ) as f:
        f.write(
            '{"type":"FeatureCollection","features":['
        )

        first = True

        for feature in feature_generator(
            species,
            paths,
            chunk_size,
        ):
            if not first:
                f.write(",")

            json.dump(
                feature,
                f,
                separators=(",", ":"),
            )

            first = False

        f.write("]}")

    return output


def run_tippecanoe(
    species: str,
    scenario: str,
    geojson: Path,
    config,
):
    scenario = validate_scenario(scenario)

    output_dir = (
        PBF
        / scenario
        / species
    )

    if (
        output_dir.exists()
        and config["force"]
    ):
        shutil.rmtree(output_dir)

    output_dir.mkdir(
        parents=True,
        exist_ok=True,
    )

    command = [
        "tippecanoe",
        "--force",
        "--no-tile-size-limit",
        "--no-feature-limit",
        "--no-tile-compression",
        "--base-zoom",
        str(config["min_zoom"]),
        "--minimum-zoom",
        str(config["min_zoom"]),
        "--maximum-zoom",
        str(config["max_zoom"]),
        "--output-to-directory",
        str(output_dir),
        str(geojson),
    ]

    print("[tippecanoe]")
    print(" ".join(command))

    subprocess.run(
        command,
        check=True,
    )

    return output_dir


def process_species(
    species: str,
    scenario: str,
    config,
):
    scenario = validate_scenario(scenario)

    print()
    print("=" * 70)
    print(
        f"[species] {species}"
    )
    print(
        f"[scenario] {scenario}"
    )
    print("=" * 70)

    paths = find_species_files(
        species,
        scenario,
    )

    print(
        f"[input] current = {paths['current']}"
    )

    print(
        f"[input] fut1    = {paths['fut1']}"
    )

    print(
        f"[input] fut2    = {paths['fut2']}"
    )

    print(
        f"[input] fut3    = {paths['fut3']}"
    )

    check_rasters(paths)

    geojson = write_geojson(
        species,
        scenario,
        paths,
        config["chunk_size"],
    )

    output = run_tippecanoe(
        species,
        scenario,
        geojson,
        {
            "min_zoom": config["min_zoom"],
            "max_zoom": config["max_zoom"],
            "force": config["force"],
        },
    )

    if not config["keep_geojson"]:
        geojson.unlink(
            missing_ok=True
        )

    print(
        f"[done] {scenario} / {species} -> {output}"
    )

    return species


def check_tippecanoe():
    if shutil.which("tippecanoe") is None:
        raise RuntimeError(
            "Tippecanoe is not installed or is not in PATH.\n"
            "On macOS: brew install tippecanoe"
        )


def build_scenario(
    scenario: str,
    species,
    config,
):
    scenario = validate_scenario(scenario)

    print()
    print("=" * 70)
    print(
        f"[build] Scenario: {scenario}"
    )
    print(
        f"[build] Species: {len(species)}"
    )
    print("=" * 70)

    worker_count = int(
        config.get("workers", 1)
    )

    process_config = {
        "min_zoom": config["tippecanoe"][
            "min_zoom"
        ],
        "max_zoom": config["tippecanoe"][
            "max_zoom"
        ],
        "force": config["force"],
        "chunk_size": config["chunk_size"],
        "keep_geojson": config[
            "keep_geojson"
        ],
    }

    if worker_count <= 1:
        for species_name in species:
            process_species(
                species_name,
                scenario,
                process_config,
            )

    else:
        with ThreadPoolExecutor(
            max_workers=worker_count
        ) as executor:
            futures = {
                executor.submit(
                    process_species,
                    species_name,
                    scenario,
                    process_config,
                ): species_name
                for species_name in species
            }

            for future in as_completed(
                futures
            ):
                species_name = futures[
                    future
                ]

                try:
                    future.result()

                except Exception as exc:
                    print(
                        f"[ERROR] "
                        f"{scenario} / "
                        f"{species_name}: "
                        f"{exc}",
                        file=sys.stderr,
                    )

                    raise


def main():
    parser = argparse.ArgumentParser(
        description=(
            "Build CRTE PBF tiles from "
            "EU-Trees4F ENS-SDMS."
        )
    )

    parser.add_argument(
        "--species",
        help=(
            "Process only this species, "
            "e.g. Quercus_robur"
        ),
    )

    parser.add_argument(
        "--scenario",
        choices=SUPPORTED_SCENARIOS,
        help=(
            "Climate scenario to process. "
            "Defaults to all configured scenarios."
        ),
    )

    parser.add_argument(
        "--all",
        action="store_true",
        help="Process all detected species",
    )

    parser.add_argument(
        "--list",
        action="store_true",
        help="List detected species",
    )

    args = parser.parse_args()

    config = load_config()

    ensure_directories()
    check_tippecanoe()

    download_dataset(
        config["download_url"]
    )

    extract_dataset()

    species = discover_species()

    if not species:
        raise RuntimeError(
            "No species found in extracted "
            "EU-Trees4F files."
        )

    if args.list:
        for name in species:
            print(name)

        return

    configured_scenarios = [
        validate_scenario(scenario)
        for scenario in config.get(
            "scenarios",
            SUPPORTED_SCENARIOS,
        )
    ]

    if args.scenario:
        scenarios = [
            validate_scenario(args.scenario)
        ]

    else:
        scenarios = configured_scenarios

    if args.species:
        if args.species not in species:
            print("Species available:")

            for name in species:
                print(f"  {name}")

            raise RuntimeError(
                f"Unknown species: "
                f"{args.species}"
            )

        process_config = {
            "min_zoom": config[
                "tippecanoe"
            ]["min_zoom"],
            "max_zoom": config[
                "tippecanoe"
            ]["max_zoom"],
            "force": config["force"],
            "chunk_size": config[
                "chunk_size"
            ],
            "keep_geojson": config[
                "keep_geojson"
            ],
        }

        for scenario in scenarios:
            process_species(
                args.species,
                scenario,
                process_config,
            )

        return

    if not args.all:
        print("Detected species:")

        for name in species:
            print(f"  {name}")

        print()
        print("Run:")
        print(
            "  python build.py "
            "--species Quercus_robur"
        )

        print()
        print("or:")

        print(
            "  python build.py "
            "--species Quercus_robur "
            "--scenario rcp45"
        )

        print()
        print("or:")

        print(
            "  python build.py --all"
        )

        return

    for scenario in scenarios:
        build_scenario(
            scenario,
            species,
            config,
        )

    print()
    print("=" * 70)
    print("[DONE] All scenarios processed")
    print("=" * 70)


if __name__ == "__main__":
    main()
