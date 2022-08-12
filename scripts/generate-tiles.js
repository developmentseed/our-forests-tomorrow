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
  const jsonPath = `${GEOJSON}/species/${species}`
  const pbfPath = `${PBF}/species/${species}`
  execSync(`rm -rf ${pbfPath}/* || true`)
  execSync(`rm -rf ${pbfPath} || true`)
  if (!SPECIES_WHITELIST.includes(species)) return
  console.log(species)
  execSync(`mkdir ${pbfPath}`)
  GRIDS.forEach((grid) => {
    execSync(
      `tippecanoe --force --no-tile-size-limit --no-feature-limit --base-zoom=${grid.minZoom} --minimum-zoom=${grid.minZoom} --maximum-zoom=${grid.maxZoom} --output-to-directory ${pbfPath}/${grid.res} ${jsonPath}_${grid.res}.geojson`
    )
  })
  GRIDS.forEach((grid) => {
    execSync(`mv ${pbfPath}/${grid.res}/* ${pbfPath}`)
    execSync(`rm -rf ${pbfPath}/${grid.res}`)
  })
})
