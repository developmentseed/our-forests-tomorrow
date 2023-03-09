#!/usr/bin/env node
import dotenv from 'dotenv'
import fs from 'fs'
import { Configuration, OpenAIApi } from 'openai'
import { SPECIES_WHITELIST, DALL_E } from '../src/constants_common.js'
// const SIZE = '1024x1024'
const SIZE = '512x512'

const { species: allSpecies } = JSON.parse(
  fs.readFileSync('./public/locales/en/translation.json')
)

dotenv.config()

const PROMPTS = [
  {
    prompt: (species, name) =>
      `A watercolor picture of a single ${name} tree (${species}) with transparent background whole tree white background`,
    filename: (species, index) => `${species} - watercolor ${index}.png`,
    n: 5,
  },
  // {
  //   prompt: (species, name) =>
  //     `A colored engraving drawing of a single ${name} tree (${species}) with transparent background whole tree white background`,
  //   filename: (species, index) => `${species} - engraving ${index}.png`,
  //   n: 5,
  // },
  // {
  //   prompt: (species, name) =>
  //     `A watercolor picture of a single ${name} (${species}) leaf on a white background`,
  //   filename: (species, index) => `${species} - leaf ${index}.png`,
  //   n: 5,
  // },
  // {
  //   prompt: (species, name) =>
  //     `A closeup photography of ${name} tree (${species}) bark`,
  //   filename: (species, index) => `${species} - bark ${index}.png`,
  //   n: 5,
  // },
  // {
  //   prompt: (species, name) =>
  //     `A watercolor drawing of a ${name} tree (${species}) fruit`,
  //   filename: (species, index) => `${species} - fruit ${index}.png`,
  //   n: 5,
  // },
  // {
  //   prompt: (species, name) =>
  //     `A colored engraving drawing of a ${name} tree (${species}) fruit`,
  //   filename: (species, index) => `${species} - fruit engraving ${index}.png`,
  //   n: 5,
  // },
  {
    prompt: (species, name) =>
      `A watercolor picture of the silhouette of a single ${name} tree (${species}) with transparent background whole tree white background`,
    filename: (species, index) => `${species} - Silhouette ${index}.png`,
    n: 5,
  },
]

const configuration = new Configuration({
  organization: 'org-pK8VPkWXyaHaOeXhJdPGz2XT',
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

const speciesEntries = Object.entries(allSpecies)
for (let s = 0; s < speciesEntries.length; s++) {
  const [species, name] = speciesEntries[s]

  if (!SPECIES_WHITELIST.includes(species)) continue

  const speciesSanitized = species.replace('_', ' ')

  for (let p = 0; p < PROMPTS.length; p++) {
    const prompt = PROMPTS[p].prompt(speciesSanitized, name)
    console.log(prompt)
    let response
    try {
      response = await openai.createImage({
        prompt,
        n: PROMPTS[p].n,
        size: SIZE,
      })
    } catch (e) {
      console.log('dall-e error with prompt:', prompt)
      fs.writeFileSync(`${DALL_E}/error.json`, JSON.stringify(e))
    }
    if (!response) continue
    for (let r = 0; r < response.data.data.length; r++) {
      const path = `${DALL_E}/${PROMPTS[p].filename(species, r)}`
      console.log('writing ', path)
      try {
        const url = response.data.data[r].url
        const imgResponse = await fetch(url)
        const imgBlob = await imgResponse.blob()
        const arrayBuffer = await imgBlob.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        fs.writeFileSync(path, buffer)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
