#!/usr/bin/env node

const fs = require('fs')
const { SPECIES } = require('./constants')

const dirs = fs
  .readdirSync('./in/EU-Trees4F_dataset/single_models/')
  .filter((p) => p !== '.DS_Store')

fs.writeFile(SPECIES, JSON.stringify(dirs), () => {})
