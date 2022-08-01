#!/usr/bin/env node
const fs = require('fs')
const { SPECIES, GRIDS, SPECIES_WHITELIST, PBF } = require('./constants')
const speciesList = JSON.parse(fs.readFileSync(SPECIES, 'utf-8'))
const exec = require('child_process').execSync

speciesList.forEach((species) => {
  exec(`rm -rf ${PBF}/${species}/* || true`)
  exec(`rm -rf ${PBF}/${species} || true`)
  if (!SPECIES_WHITELIST.includes(species)) return
  exec(`mkdir ${PBF}/${species}`)
  GRIDS.forEach((grid) => {
    exec(
      `tippecanoe --force --no-tile-size-limit --no-feature-limit --base-zoom=${grid.minZoom} --minimum-zoom=${grid.minZoom} --maximum-zoom=${grid.maxZoom} --output-to-directory ${PBF}/${species}/${grid.res} out/geojson/${species}_${grid.res}.geojson`
    )
  })
  GRIDS.forEach((grid) => {
    exec(`mv ${PBF}/${species}/${grid.res}/* ${PBF}/${species}`)
    exec(`rm -rf ${PBF}/${species}/${grid.res}`)
  })
})
