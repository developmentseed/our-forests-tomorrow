#!/usr/bin/env node
import fs from 'fs'
import {
  SPECIES,
  SPECIES_WHITELIST,
  STATS,
  STATS_FINAL,
} from '../src/constants_common.js'
import { parse } from 'csv-parse/sync'

const speciesList = JSON.parse(fs.readFileSync(SPECIES, 'utf-8'))

const s = speciesList.flatMap((species) => {
  if (!SPECIES_WHITELIST.includes(species)) return []

  const raw = fs.readFileSync(`${STATS}/${species}.csv`)
  let statsArr = parse(raw, {
    columns: true,
    skip_empty_lines: true,
  })

  const stats = Object.fromEntries(
    statsArr.map((regionStats) => {
      const regionStatsByYear = Object.fromEntries(
        ['2035', '2065', '2095'].map((y) => {
          return [
            y,
            [
              parseInt(regionStats[`count_${y}_decolonized`]),
              parseInt(regionStats[`count_${y}_stable`]),
              parseInt(regionStats[`count_${y}_suitable`]),
            ],
          ]
        })
      )

      return [regionStats.region_id, regionStatsByYear]
    })
  )
  return [[species, stats]]
})

const json = Object.fromEntries(s)

fs.writeFileSync(STATS_FINAL, JSON.stringify(json))
