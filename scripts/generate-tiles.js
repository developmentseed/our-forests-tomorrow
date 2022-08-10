#!/usr/bin/env node
import fs from 'fs'
import {
  SPECIES,
  GRIDS,
  SPECIES_WHITELIST,
  PBF,
  GEOJSON,
} from '../src/constants_common.js'
import { execSync } from 'child_process'

const speciesList = JSON.parse(fs.readFileSync(SPECIES, 'utf-8'))

speciesList.forEach((species) => {
  execSync(`rm -rf ${PBF}/${species}/* || true`)
  execSync(`rm -rf ${PBF}/${species} || true`)
  if (!SPECIES_WHITELIST.includes(species)) return
  console.log(species)
  execSync(`mkdir ${PBF}/${species}`)
  GRIDS.forEach((grid) => {
    execSync(
      `tippecanoe --force --no-tile-size-limit --no-feature-limit --base-zoom=${grid.minZoom} --minimum-zoom=${grid.minZoom} --maximum-zoom=${grid.maxZoom} --output-to-directory ${PBF}/${species}/${grid.res} ${GEOJSON}/${species}_${grid.res}.geojson`
    )
  })
  GRIDS.forEach((grid) => {
    execSync(`mv ${PBF}/${species}/${grid.res}/* ${PBF}/${species}`)
    execSync(`rm -rf ${PBF}/${species}/${grid.res}`)
  })
})
