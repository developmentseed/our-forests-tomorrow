#!/usr/bin/env node
import {
  PBF,
  BASEMAP_COUNTRIES,
  BASEMAP_REGIONS,
  IN,
  BASEMAP_COUNTRIES_SRC,
  BASEMAP_REGIONS_SRC,
  GEOJSON,
} from '../src/constants_common.js'
import { execSync } from 'child_process'

execSync(`rm -rf ${PBF}/${BASEMAP_COUNTRIES} || true`)
execSync(`mkdir ${PBF}/${BASEMAP_COUNTRIES}`)
execSync(`rm -rf ${PBF}/${BASEMAP_REGIONS} || true`)
execSync(`mkdir ${PBF}/${BASEMAP_REGIONS}`)

execSync(
  `npx mapshaper ${IN}/${BASEMAP_COUNTRIES_SRC}/${BASEMAP_COUNTRIES_SRC}.shp -o ${GEOJSON}/${BASEMAP_COUNTRIES}.json format=geojson`
)
execSync(
  `npx mapshaper ${IN}/${BASEMAP_REGIONS_SRC}/${BASEMAP_REGIONS_SRC}.shp -o ${GEOJSON}/${BASEMAP_REGIONS}.json format=geojson`
)

execSync(
  `tippecanoe -zg --force --output-to-directory ${PBF}/${BASEMAP_COUNTRIES} ${GEOJSON}/${BASEMAP_COUNTRIES}.json`
)

execSync(
  `tippecanoe -zg --force --output-to-directory ${PBF}/${BASEMAP_REGIONS} ${GEOJSON}/${BASEMAP_REGIONS}.json`
)
