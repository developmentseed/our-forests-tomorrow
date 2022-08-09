#!/usr/bin/env node
import {
  PBF,
  BASEMAP_COUNTRIES,
  BASEMAP_REGIONS,
  IN,
  BASEMAP_COUNTRIES_SRC,
  BASEMAP_REGIONS_SRC,
} from '../src/constants_common.js'
import { execSync } from 'child_process'

execSync(`rm -rf ${PBF}/${BASEMAP_COUNTRIES} || true`)
execSync(`mkdir ${PBF}/${BASEMAP_COUNTRIES}`)
execSync(`rm -rf ${PBF}/${BASEMAP_REGIONS} || true`)
execSync(`mkdir ${PBF}/${BASEMAP_REGIONS}`)

const cmd1 = `tippecanoe --minimum-zoom=0 --maximum-zoom=8 --force --output-to-directory ${PBF}/${BASEMAP_COUNTRIES} ${IN}/${BASEMAP_COUNTRIES_SRC}`
const cmd2 = `tippecanoe --minimum-zoom=0 --maximum-zoom=8 --force --output-to-directory ${PBF}/${BASEMAP_REGIONS} ${IN}/${BASEMAP_REGIONS_SRC}`
console.log(cmd1)
console.log(cmd2)
execSync(cmd1)
execSync(cmd2)
