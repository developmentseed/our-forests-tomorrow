#!/usr/bin/env node

import { SPECIES, SPECIES_DETAIL } from '../src/constants_common.js'
import fs from 'fs'
const speciesList = JSON.parse(fs.readFileSync(SPECIES, 'utf-8'))

const allSpeciesDetail = {}

speciesList.forEach((currentSpeciesId) => {
  const currentSpeciesDetail = {
    en: {},
    fr: {},
  }

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
        const wdData = wd.entities[id]
        if (wdData.aliases.en) {
          currentSpeciesDetail.en.name = wdData.labels.en.value
          currentSpeciesDetail.en.aliases = wdData.aliases.en.map(
            (a) => a.value
          )
        }
        if (wdData.aliases.fr) {
          currentSpeciesDetail.fr.name = wdData.labels.en.value
          currentSpeciesDetail.fr.aliases = wdData.aliases.fr.map(
            (a) => a.value
          )
        }
        currentSpeciesDetail.en.extract = wikiEn.extract
        currentSpeciesDetail.fr.extract = wikiFr.extract
        currentSpeciesDetail.thumbnail = wikiEn.thumbnail
        currentSpeciesDetail.originalimage = wikiEn.originalimage
        currentSpeciesDetail.media = wikiMedia.items

        allSpeciesDetail[currentSpeciesId] = currentSpeciesDetail
        fs.writeFileSync(SPECIES_DETAIL, JSON.stringify(allSpeciesDetail))
      })
    })
})
