#!/usr/bin/env node

import { SPECIES } from '../src/constants_common.js'
import fs from 'fs'

const dirs = fs
  .readdirSync('./in/EU-Trees4F_dataset/single_models/')
  .filter((p) => p !== '.DS_Store')

fs.writeFile(SPECIES, JSON.stringify(dirs), () => {})
