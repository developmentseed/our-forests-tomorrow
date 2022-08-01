#!/usr/bin/env node
const exec = require('child_process').execSync

exec(`rm -rf out/pbf/Fraxinus_excelsior/* || true`)

exec(
  `tippecanoe --force --no-tile-size-limit --no-feature-limit --base-zoom=0 --minimum-zoom=0 --maximum-zoom=2 --output-to-directory out/pbf/Fraxinus_excelsior/80 out/geojson/Fraxinus_excelsior_80.geojson`
)
exec(
  `tippecanoe --force --no-tile-size-limit --no-feature-limit --base-zoom=3 --minimum-zoom=3 --maximum-zoom=4 --output-to-directory out/pbf/Fraxinus_excelsior/40 out/geojson/Fraxinus_excelsior_40.geojson`
)
exec(
  `tippecanoe --force --no-tile-size-limit --no-feature-limit --base-zoom=5 --minimum-zoom=5 --maximum-zoom=6  --output-to-directory out/pbf/Fraxinus_excelsior/20 out/geojson/Fraxinus_excelsior_20.geojson`
)
exec(
  `tippecanoe --force --no-tile-size-limit --no-feature-limit --base-zoom=7 --minimum-zoom=7 --maximum-zoom=8  --output-to-directory out/pbf/Fraxinus_excelsior/10 out/geojson/Fraxinus_excelsior_10.geojson`
)

exec(`mv out/pbf/Fraxinus_excelsior/80/* out/pbf/Fraxinus_excelsior`)
exec(`mv out/pbf/Fraxinus_excelsior/40/* out/pbf/Fraxinus_excelsior`)
exec(`mv out/pbf/Fraxinus_excelsior/20/* out/pbf/Fraxinus_excelsior`)
exec(`mv out/pbf/Fraxinus_excelsior/10/* out/pbf/Fraxinus_excelsior`)

exec(`rm -rf out/pbf/Fraxinus_excelsior/80/`)
exec(`rm -rf out/pbf/Fraxinus_excelsior/40/`)
exec(`rm -rf out/pbf/Fraxinus_excelsior/20/`)
exec(`rm -rf out/pbf/Fraxinus_excelsior/10/`)
