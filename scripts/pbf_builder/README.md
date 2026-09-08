
# PBF Builder

This script transforms the EU-Trees4F ENS-SDMS raster data into vector tiles (PBF) used by the MapLibre frontend.

The builder supports the two climate scenarios included in the original study:

- **RCP4.5** — emissions peak around mid-century
- **RCP8.5** — high-emissions scenario

The data for each scenario is generated independently so that the frontend can switch between scenarios without mixing datasets.

## Directory structure

The builder uses the following directories:

```text
scripts/pbf_builder/
├── build.py
├── config.yaml
└── README.md

data/
└── pbf_builder/
    ├── raw/
    │   └── EU-Trees4F_ens-sdms.zip
    ├── extracted/
    │   └── ...
    └── geojson/
        ├── rcp45/
        │   └── <species>.geojson
        └── rcp85/
            └── <species>.geojson

public/
└── pbf/
    ├── rcp45/
    │   ├── <species>/
    │   │   ├── 2/
    │   │   ├── 3/
    │   │   └── ...
    │   └── ...
    └── rcp85/
        ├── <species>/
        │   ├── 2/
        │   ├── 3/
        │   └── ...
        └── ...
```

The files under `data/pbf_builder/` are intermediate files and should not be committed to the repository.

The PBF tiles under `public/pbf/` are served directly by the application.

## Data source

The builder automatically downloads the following dataset:

```text
EU-Trees4F_ens-sdms.zip
```

The dataset contains potential suitability probabilities for European tree species.

For each species, the builder uses:

- `cur2005` as the reference period;
- `2035` as the first future horizon;
- `2065` as the second future horizon;
- `2095` as the third future horizon.

Future projections are available for both climate scenarios:

- `rcp45`
- `rcp85`

The `cur2005` raster is shared by both scenarios. Future rasters are scenario-specific.

## Raster naming convention

The builder expects files following this naming convention:

```text
<species>_ens-sdms_cur2005_prob_pot.tif

<species>_ens-sdms_rcp45_fut2035_prob_pot.tif
<species>_ens-sdms_rcp45_fut2065_prob_pot.tif
<species>_ens-sdms_rcp45_fut2095_prob_pot.tif

<species>_ens-sdms_rcp85_fut2035_prob_pot.tif
<species>_ens-sdms_rcp85_fut2065_prob_pot.tif
<species>_ens-sdms_rcp85_fut2095_prob_pot.tif
```

The builder validates that the required rasters exist before generating the tiles.

## Climate scenarios

The supported scenarios are:

```text
rcp45
rcp85
```

They are configured in `config.yaml`:

```yaml
scenarios:
  - rcp45
  - rcp85
```

The scenario is therefore no longer hard-coded in the build process.

Each scenario produces its own set of PBF tiles.

## Building the data

### List available species

```bash
python build.py --list
```

### Build one species for RCP4.5

```bash
python build.py \
  --species Quercus_ilex \
  --scenario rcp45
```

Output:

```text
public/pbf/rcp45/Quercus_ilex/
```

### Build one species for RCP8.5

```bash
python build.py \
  --species Quercus_ilex \
  --scenario rcp85
```

Output:

```text
public/pbf/rcp85/Quercus_ilex/
```

### Build one species for all configured scenarios

```bash
python build.py \
  --species Quercus_ilex
```

This generates:

```text
public/pbf/rcp45/Quercus_ilex/
public/pbf/rcp85/Quercus_ilex/
```

### Build all species

```bash
python build.py --all
```

This generates all detected species for all scenarios configured in `config.yaml`.

## Build pipeline

For each `scenario × species` combination, the builder performs the following steps:

```text
EU-Trees4F rasters
       │
       ├── current 2005
       ├── future 2035
       ├── future 2065
       └── future 2095
              │
              ▼
       raster validation
              │
              ▼
           GeoJSON
              │
              ▼
         Tippecanoe
              │
              ▼
       vector tiles (PBF)
              │
              ▼
public/pbf/<scenario>/<species>/
```

## Feature properties

Each generated feature contains the suitability probability for the reference period and the three future horizons.

Example:

```json
{
  "species": "Quercus_ilex",
  "current": 850,
  "fut1": 820,
  "fut2": 760,
  "fut3": 680
}
```

The properties correspond to:

| Property | Year |
|---|---:|
| `current` | 2005 |
| `fut1` | 2035 |
| `fut2` | 2065 |
| `fut3` | 2095 |

The scenario is not stored in every feature. It is represented by the directory containing the tiles.

For example:

```text
/pbf/rcp45/Quercus_ilex/{z}/{x}/{y}.pbf
```

contains RCP4.5 data.

Likewise:

```text
/pbf/rcp85/Quercus_ilex/{z}/{x}/{y}.pbf
```

contains RCP8.5 data.

This keeps the two scenarios completely independent.

## Suitability classification

The suitability classification is identical for both scenarios.

Suitability probabilities are represented on a scale from `0` to `1000`.

The suitability threshold is `500`.

The future value is always compared with the 2005 reference value.

For a given cell:

```text
current >= 500
future >= 500
```

The cell remains **suitable / stable**.

```text
current >= 500
future < 500
```

The cell is considered **decolonized**.

```text
current < 500
future >= 500
```

The cell becomes **newly suitable**.

The same classification is applied to RCP4.5 and RCP8.5.

Only the future climate projection changes between scenarios.

## Configuration

The configuration file is:

```text
scripts/pbf_builder/config.yaml
```

Example:

```yaml
download_url: "https://ies-ows.jrc.ec.europa.eu/efdac/download/EU-Trees4F/EU-Trees4F_ens-sdms.zip"

scenarios:
  - rcp45
  - rcp85

model: "ens-sdms"

chunk_size: 500000

workers: 1

keep_geojson: false

force: true

tippecanoe:
  min_zoom: 2
  max_zoom: 8
```

### `scenarios`

List of scenarios generated when no `--scenario` argument is provided.

Example:

```yaml
scenarios:
  - rcp45
  - rcp85
```

### `chunk_size`

Approximate number of raster pixels processed per chunk.

A lower value reduces memory usage but increases processing overhead.

### `workers`

Number of species processed in parallel.

For machines with limited memory, keeping:

```yaml
workers: 1
```

is recommended.

### `keep_geojson`

If `true`, intermediate GeoJSON files are kept under:

```text
data/pbf_builder/geojson/
```

Otherwise, they are removed after Tippecanoe finishes.

### `force`

If `true`, existing PBF output for the species and scenario is removed before rebuilding.

## Dependencies

The builder requires:

- Python 3
- `rasterio`
- `numpy`
- `PyYAML`
- Tippecanoe

Install the Python dependencies with:

```bash
pip install rasterio numpy pyyaml
```

Tippecanoe must also be available in the `PATH`.

On macOS with Homebrew:

```bash
brew install tippecanoe
```

Verify the installation with:

```bash
tippecanoe --version
```

## Testing

Before generating the complete dataset, it is recommended to test with a single species.

For example:

```bash
python build.py \
  --species Quercus_ilex \
  --scenario rcp45
```

Then:

```bash
python build.py \
  --species Quercus_ilex \
  --scenario rcp85
```

Verify that both directories exist:

```text
public/pbf/rcp45/Quercus_ilex/
public/pbf/rcp85/Quercus_ilex/
```

Both directories should contain PBF tiles.

Once the single-species build works, the complete dataset can be generated with:

```bash
python build.py --all
```

## Frontend integration

The frontend builds the PBF tile URL from three parameters:

```text
scenario
species
z/x/y
```

For RCP4.5:

```text
/pbf/rcp45/<species>/{z}/{x}/{y}.pbf
```

For RCP8.5:

```text
/pbf/rcp85/<species>/{z}/{x}/{y}.pbf
```

Changing the climate scenario in the UI therefore changes the PBF source used by MapLibre.

## Why separate the RCPs?

RCP4.5 and RCP8.5 represent different climate projections and must not be mixed.

Keeping them in separate directories:

```text
public/pbf/
├── rcp45/
└── rcp85/
```

has several advantages:

- clear separation between scenarios;
- simple scenario switching in the frontend;
- independent browser caching;
- independent data generation;
- RCP4.5 can be regenerated without touching RCP8.5;
- the deployed data structure remains easy to understand.

The same principle should be applied to derived statistics: statistics should be indexed by scenario in the same way as the PBF data.

## Cleaning generated data

Remove all intermediate files:

```bash
rm -rf data/pbf_builder
```

Remove all generated PBF tiles:

```bash
rm -rf public/pbf
```

The complete dataset can then be rebuilt with:

```bash
python build.py --all
```

## Summary

The builder now generates data for both climate scenarios:

```text
                 EU-Trees4F
                     │
          ┌──────────┴──────────┐
          │                     │
       RCP4.5                 RCP8.5
          │                     │
     ┌────┼────┐           ┌────┼────┐
     │    │    │           │    │    │
   2035 2065 2095        2035 2065 2095
     │    │    │           │    │    │
     └────┴────┘           └────┴────┘
          │                     │
          └──────────┬──────────┘
                     │
               baseline 2005
                     │
                     ▼
              classification
                     │
                     ▼
                 MapLibre
```

The 2005 reference remains common to both scenarios, while future projections are generated independently for RCP4.5 and RCP8.5.
