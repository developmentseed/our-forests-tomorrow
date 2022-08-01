#!/usr/bin/env node
const exec = require('child_process').execSync

exec(`rm -r out/pbf/Fraxinus_excelsior/*`)

exec(
  `tippecanoe --force --no-tile-size-limit --no-feature-limit --base-zoom=0 --minimum-zoom=0 --maximum-zoom=3  --output-to-directory out/pbf/Fraxinus_excelsior/80 out/geojson/Fraxinus_excelsior_80.geojson`
)
exec(
  `tippecanoe --force --no-tile-size-limit --no-feature-limit --base-zoom=4 --minimum-zoom=4 --maximum-zoom=5  --output-to-directory out/pbf/Fraxinus_excelsior/40 out/geojson/Fraxinus_excelsior_40.geojson`
)
exec(
  `tippecanoe --force --no-tile-size-limit --no-feature-limit --base-zoom=6 --minimum-zoom=6 --maximum-zoom=8  --output-to-directory out/pbf/Fraxinus_excelsior/20 out/geojson/Fraxinus_excelsior_20.geojson`
)

exec(`mv out/pbf/Fraxinus_excelsior/80/* out/pbf/Fraxinus_excelsior`)
exec(`mv out/pbf/Fraxinus_excelsior/40/* out/pbf/Fraxinus_excelsior`)
exec(`mv out/pbf/Fraxinus_excelsior/20/* out/pbf/Fraxinus_excelsior`)

exec(`rm -rf out/pbf/Fraxinus_excelsior/80/`)
exec(`rm -rf out/pbf/Fraxinus_excelsior/40/`)
exec(`rm -rf out/pbf/Fraxinus_excelsior/20/`)
