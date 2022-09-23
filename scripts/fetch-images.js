#!/usr/bin/env node
import fs from 'fs'
import { execSync } from 'child_process'
import {
  SPECIES_DATA,
  SPECIES_MEDIA,
  SPECIES_IMAGES,
} from '../src/constants_common.js'

const species = JSON.parse(fs.readFileSync(SPECIES_DATA))
const speciesMedia = JSON.parse(fs.readFileSync(SPECIES_MEDIA))
execSync(`rm -rf ${SPECIES_IMAGES}/**`)
execSync(`mkdir ${SPECIES_IMAGES}/thumbs/`)
execSync(`mkdir ${SPECIES_IMAGES}/originals/`)
execSync(`mkdir ${SPECIES_IMAGES}/media/`)

Object.entries(species).map(([speciesId, data]) => {
  const thumb = data.thumbnail.source
  const original = data.originalimage.source

  execSync(`curl ${thumb} > ${SPECIES_IMAGES}/thumbs/${speciesId}.jpg`)
  execSync(`curl ${original} > ${SPECIES_IMAGES}/originals/${speciesId}.jpg`)

  execSync(`mkdir ${SPECIES_IMAGES}/media/${speciesId}`)
  speciesMedia[speciesId].items.forEach((item) => {
    try {
      execSync(
        `curl https:${
          item.srcset[item.srcset.length - 1].src
        } > '${SPECIES_IMAGES}/media/${speciesId}/${speciesId}_${encodeURI(
          item.title.replace('File:', '').replace(/'/g, '_')
        )}'`
      )
    } catch (e) {
      console.log(e)
    }
  })
})

// https://bulkresizephotos.com/en?output=png
//https://draeton.github.io/stitches/ (used 70%)
//https://cloudconvert.com/png-to-webp
