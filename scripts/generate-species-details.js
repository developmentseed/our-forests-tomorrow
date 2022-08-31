#!/usr/bin/env node

import {
  SPECIES,
  SPECIES_DATA,
  SPECIES_META_MANUAL,
} from '../src/constants_common.js'
import fs from 'fs'
const speciesList = JSON.parse(fs.readFileSync(SPECIES, 'utf-8'))
const speciesMetaManual = JSON.parse(
  fs.readFileSync(SPECIES_META_MANUAL, 'utf-8')
)

const allSpeciesData = {}

speciesList.forEach((currentSpeciesId) => {
  fetch(
    `https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=en&type=item&continue=0&search=${currentSpeciesId}`
  )
    .then((r) => r.json())
    .then((data) => {
      const mainResult = data.search[0]
      const id = mainResult.id

      Promise.all(
        [
          `https://www.wikidata.org/wiki/Special:EntityData/${id}.json`,
          `https://en.wikipedia.org/api/rest_v1/page/summary/${currentSpeciesId}`,
          `https://fr.wikipedia.org/api/rest_v1/page/summary/${currentSpeciesId}`,
          `https://en.wikipedia.org/api/rest_v1/page/media-list/${currentSpeciesId}`,
        ].map((url) => fetch(url).then((resp) => resp.json()))
      ).then(([wd, wikiEn, wikiFr, wikiMedia]) => {
        allSpeciesData[currentSpeciesId] = {
          labels: {
            en: {},
            fr: {},
          },
        }

        const wdData = wd.entities[id]
        // allSpeciesLabels.en[currentSpeciesId].name = wdData.labels.en.value
        if (wdData.aliases.en) {
          allSpeciesData[currentSpeciesId].labels.en.aliases =
            wdData.aliases.en.map((a) => a.value)
        }
        // allSpeciesLabels.fr[currentSpeciesId].name = wdData.labels.en.value
        if (wdData.aliases.fr) {
          allSpeciesData[currentSpeciesId].labels.fr.aliases =
            wdData.aliases.fr.map((a) => a.value)
        }

        allSpeciesData[currentSpeciesId].labels.en.extract = wikiEn.extract
        allSpeciesData[currentSpeciesId].labels.fr.extract = wikiFr.extract

        allSpeciesData[currentSpeciesId].thumbnail = wikiEn.thumbnail
        allSpeciesData[currentSpeciesId].originalimage = wikiEn.originalimage
        // currentSpeciesDetail.media = wikiMedia.items

        if (
          speciesMetaManual[currentSpeciesId] &&
          speciesMetaManual[currentSpeciesId].color
        ) {
          allSpeciesData[currentSpeciesId].color =
            speciesMetaManual[currentSpeciesId].color
        } else {
          allSpeciesData[currentSpeciesId].color = [
            Math.floor(150 * Math.random()),
            200 + Math.floor(50 * Math.random()),
            Math.floor(150 * Math.random()),
          ]
        }

        const sorted = Object.entries(allSpeciesData)
        sorted.sort(([keyA], [keyB]) => {
          return keyA.localeCompare(keyB)
        })

        fs.writeFileSync(
          SPECIES_DATA,
          JSON.stringify(Object.fromEntries(sorted))
        )
      })
    })
})
