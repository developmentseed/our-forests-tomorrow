#!/usr/bin/env node
import fs from 'fs'

import {
  SPECIES,
  QGIS_BATCH_MAIN,
  GRIDS,
  SPECIES_WHITELIST,
  EUTREES4F_DATASET_ABS_PATH,
  GEOJSON_ABS_PATH,
  STATS_ABS_PATH,
  QGIS_BATCH_STATS,
  QGIS_BATCH_EXTENTS,
} from '../src/constants_common.js'

const speciesList = JSON.parse(fs.readFileSync(SPECIES, 'utf-8'))

const batchMain = speciesList.flatMap((species) => {
  if (!SPECIES_WHITELIST.includes(species)) return []
  return GRIDS.flatMap((grid) => ({
    "PARAMETERS": {
      "curbinnat": `'${EUTREES4F_DATASET_ABS_PATH}/bin/${species}/${species}_ens-sdms_cur_bin_nat.tif'`,
      "grid": `'/Users/erik/Work/eu-trees4f-viz/in/grid${grid.res}.geojson'`,
      "hex_grid": `'/Users/erik/Work/eu-trees4f-viz/in/grid${grid.res}_hex.geojson'`,
      "sdms_rcp45_fut1": `'${EUTREES4F_DATASET_ABS_PATH}/prob/${species}_ens-sdms_rcp45_fut1_prob_pot.tif'`,
      "sdms_rcp45_fut2": `'${EUTREES4F_DATASET_ABS_PATH}/prob/${species}_ens-sdms_rcp45_fut2_prob_pot.tif'`,
      "sdms_rcp45_fut3": `'${EUTREES4F_DATASET_ABS_PATH}/prob/${species}_ens-sdms_rcp45_fut3_prob_pot.tif'`,
      "sdms_rcp85_fut1": `'${EUTREES4F_DATASET_ABS_PATH}/prob/${species}_ens-sdms_rcp85_fut1_prob_pot.tif'`,
      "sdms_rcp85_fut2": `'${EUTREES4F_DATASET_ABS_PATH}/prob/${species}_ens-sdms_rcp85_fut2_prob_pot.tif'`,
      "sdms_rcp85_fut3": `'${EUTREES4F_DATASET_ABS_PATH}/prob/${species}_ens-sdms_rcp85_fut3_prob_pot.tif'`
    },
    "OUTPUTS": {
      "native:joinattributestable_1:hex": `${GEOJSON_ABS_PATH}/species/${species}_${grid.res.toString()}_hex.geojson`,
      "native:reprojectlayer_1:final": `${GEOJSON_ABS_PATH}/species/${species}_${grid.res.toString()}.geojson`
    }
  }))
})

fs.writeFileSync(QGIS_BATCH_MAIN, JSON.stringify(batchMain))

const batchExtents = speciesList.flatMap((species) => {
  if (!SPECIES_WHITELIST.includes(species)) return []
  return GRIDS.flatMap((grid) => ({
    "PARAMETERS": {
      "buffer": "0.001",
      "hex": `'${GEOJSON_ABS_PATH}/species/${species}_${grid.res.toString()}_hex.geojson'`

    },
    "OUTPUTS": {
      "rcp45": `${GEOJSON_ABS_PATH}/extents/${species}_${grid.res.toString()}_extents_rcp45.geojson`,
      "rcp85": `${GEOJSON_ABS_PATH}/extents/${species}_${grid.res.toString()}_extents_rcp85.geojson`
    }
  }))
})

fs.writeFileSync(QGIS_BATCH_EXTENTS, JSON.stringify(batchExtents))

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
