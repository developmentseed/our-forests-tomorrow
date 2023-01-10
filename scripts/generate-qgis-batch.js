#!/usr/bin/env node
import fs from 'fs'

import {
  SPECIES,
  QGIS_BATCH_MAIN,
  GRIDS,
  RCP,
  SPECIES_WHITELIST,
  EUTREES4F_DATASET_ABS_PATH,
  GEOJSON_ABS_PATH,
  STATS_ABS_PATH,
  QGIS_BATCH_STATS,
  RCPS,
} from '../src/constants_common.js'

const speciesList = JSON.parse(fs.readFileSync(SPECIES, 'utf-8'))

const batchMain = speciesList.flatMap((species) => {
  if (!SPECIES_WHITELIST.includes(species)) return []
  return GRIDS.flatMap((grid) => {
    return RCPS.map((rcp) => ({
      PARAMETERS: {
        curbinnat: `'${EUTREES4F_DATASET_ABS_PATH}/bin/${species}/${species}_ens-sdms_cur_bin_nat.tif'`,
        fut1probpot: `'${EUTREES4F_DATASET_ABS_PATH}/prob/${species}_ens-sdms_rcp${rcp}_fut1_prob_pot.tif'`,
        fut2probpot: `'${EUTREES4F_DATASET_ABS_PATH}/prob/${species}_ens-sdms_rcp${rcp}_fut2_prob_pot.tif'`,
        'fut2probpot (2)': `'${EUTREES4F_DATASET_ABS_PATH}/prob/${species}_ens-sdms_rcp${rcp}_fut3_prob_pot.tif'`,
        grid: `'/Users/erik/Work/eu-trees4f-viz/in/grid${grid.res}.geojson'`,
        hex_grid: `'/Users/erik/Work/eu-trees4f-viz/in/grid${grid.res}_hex.geojson'`,
      },
      OUTPUTS: {
        'native:reprojectlayer_1:final': `${GEOJSON_ABS_PATH}/species/${species}_rcp${rcp}_${grid.res.toString()}.geojson`,
        'native:joinattributestable_1:test': `${GEOJSON_ABS_PATH}/species/${species}_rcp${rcp}_${grid.res.toString()}_hex.geojson`,
      },
    }))
  })
})

fs.writeFileSync(QGIS_BATCH_MAIN, JSON.stringify(batchMain))

// const preciseGrid = GRIDS[GRIDS.length - 1]
// const batchStats = speciesList.flatMap((species) => {
//   if (!SPECIES_WHITELIST.includes(species)) return []
//   return [
//     {
//       PARAMETERS: {
//         grid: `'${GEOJSON_ABS_PATH}/species/${species}_${preciseGrid.res.toString()}.geojson'`,
//       },
//       OUTPUTS: {
//         'qgis:executesql_1:sql_output': `${STATS_ABS_PATH}/${species}.csv`,
//       },
//     },
//   ]
// })

// fs.writeFileSync(QGIS_BATCH_STATS, JSON.stringify(batchStats))
