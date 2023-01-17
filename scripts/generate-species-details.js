#!/usr/bin/env node

import {
  SPECIES,
  SPECIES_DATA,
  SPECIES_META_MANUAL,
  SPECIES_MEDIA,
  SUPPORTED_LANGUAGES
} from '../src/constants_common.js'
import fs from 'fs'
const speciesList = JSON.parse(fs.readFileSync(SPECIES, 'utf-8'))
const speciesMetaManual = JSON.parse(
  fs.readFileSync(SPECIES_META_MANUAL, 'utf-8')
)

const allSpeciesData = {}
const allSpeciesMedia = {}

speciesList.forEach((currentSpeciesId) => {
  let aliasId
  if (
    speciesMetaManual[currentSpeciesId] &&
    speciesMetaManual[currentSpeciesId].alias
  ) {
    aliasId = speciesMetaManual[currentSpeciesId].alias
  }
  const id = aliasId || currentSpeciesId

  fetch(
    `https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=en&type=item&continue=0&search=${id}`
  )
    .then((r) => r.json())
    .then((data) => {
      const mainResult = data.search[0]
      const wdId = mainResult.id
      console.log(currentSpeciesId, id)

      const summariesUrls = SUPPORTED_LANGUAGES.map(lang => `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${id}`)

      Promise.all(
        [
          `https://www.wikidata.org/wiki/Special:EntityData/${wdId}.json`,
          `https://en.wikipedia.org/api/rest_v1/page/media-list/${id}`,
          ...summariesUrls
        ].map((url) => fetch(url).then((resp) => resp.json()))
      ).then(([wd, wikiMedia, ...summaries]) => {
        allSpeciesData[currentSpeciesId] = {
          labels: Object.fromEntries(SUPPORTED_LANGUAGES.map((lang) => [lang, {}]))
        }

        allSpeciesMedia[currentSpeciesId] = wikiMedia

        const wdData = wd.entities[wdId]

        SUPPORTED_LANGUAGES.forEach((lang, langIndex) => {
          if (wdData.aliases[lang]) {
            allSpeciesData[currentSpeciesId].labels[lang].aliases =
              wdData.aliases[lang].map((a) => a.value)
          }
          allSpeciesData[currentSpeciesId].labels[lang].extract = summaries[langIndex].extract
        })

        allSpeciesData[currentSpeciesId].thumbnail = summaries[0].thumbnail
        allSpeciesData[currentSpeciesId].originalimage = summaries[0].originalimage
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
        const sortedMedia = Object.entries(allSpeciesMedia)
        sortedMedia.sort(([keyA], [keyB]) => {
          return keyA.localeCompare(keyB)
        })

        fs.writeFileSync(
          SPECIES_DATA,
          JSON.stringify(Object.fromEntries(sorted))
        )
        fs.writeFileSync(
          SPECIES_MEDIA,
          JSON.stringify(Object.fromEntries(sortedMedia))
        )
      })
      .catch(err => console.log(err))
    })
})
