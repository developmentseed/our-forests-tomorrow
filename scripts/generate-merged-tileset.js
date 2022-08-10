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

const featuresById = {}

const grid = GRIDS[GRIDS.length - 1]

speciesList.forEach((species) => {
  if (!SPECIES_WHITELIST.includes(species)) return
  const path = `${GEOJSON}/${species}_${grid.res}.geojson`
  console.log(species, path)
  const features = JSON.parse(fs.readFileSync(path)).features

  features.forEach((feature) => {
    const id = feature.properties.id
    const newProps = Object.fromEntries(
      Object.entries(feature.properties).map(([key, value]) => {
        return [`${species}_${key}`, value]
      })
    )
    let finalFeatureProps = {}
    if (featuresById[id]) finalFeatureProps = featuresById[id].properties
    finalFeatureProps = {
      ...finalFeatureProps,
      ...newProps,
      id,
    }
    featuresById[id] = {
      type: 'Feature',
      geometry: feature.geometry,
      properties: finalFeatureProps,
    }
  })
})

const features = Object.values(featuresById)
const geojson = {
  type: 'FeatureCollection',
  //   features: Object.values(featuresById),
}

const path = `${GEOJSON}/merged.geojson`

fs.writeFileSync(path, JSON.stringify(geojson).replace('}', ', "features": ['))
features.forEach((feature, i) => {
  console.log(`${i}/${features.length}`)
  let s = JSON.stringify(feature)
  if (i < features.length - 1) {
    s += ','
  }
  fs.appendFileSync(path, s)
})
fs.appendFileSync(path, ']}')

execSync(`rm -rf ${PBF}/merged/* || true`)
execSync(`rm -rf ${PBF}/merged || true`)
execSync(`mkdir ${PBF}/merged`)
execSync(
  `tippecanoe --force --no-tile-size-limit --no-feature-limit --base-zoom=${grid.minZoom} --minimum-zoom=${grid.minZoom} --maximum-zoom=${grid.maxZoom} --output-to-directory ${PBF}/merged ${GEOJSON}/merged.geojson`
)
