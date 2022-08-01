#!/usr/bin/env node
const fs = require('fs')
const {
  SPECIES,
  QGIS_BATCH,
  GRIDS,
  RCP,
  SPECIES_WHITELIST,
  EUTREES4F_DATASET_ABS_PATH,
  GEOJSON_ABS_PATH,
} = require('./constants')
const speciesList = JSON.parse(fs.readFileSync(SPECIES, 'utf-8'))

const batch = speciesList.flatMap((species) => {
  if (!SPECIES_WHITELIST.includes(species)) return []
  return GRIDS.flatMap((grid) => {
    return [
      {
        PARAMETERS: {
          curbinnat: `'${EUTREES4F_DATASET_ABS_PATH}/bin/${species}/${species}_ens-sdms_cur_bin_nat.tif'`,
          fut1probpot: `'${EUTREES4F_DATASET_ABS_PATH}/prob/${species}_ens-sdms_rcp${RCP}_fut1_prob_pot.tif'`,
          fut2probpot: `'${EUTREES4F_DATASET_ABS_PATH}/prob/${species}_ens-sdms_rcp${RCP}_fut2_prob_pot.tif'`,
          'fut2probpot (2)': `'${EUTREES4F_DATASET_ABS_PATH}/prob/${species}_ens-sdms_rcp${RCP}_fut3_prob_pot.tif'`,
          gridsize: grid.res.toString(),
        },
        OUTPUTS: {
          'native:reprojectlayer_1:final': `${GEOJSON_ABS_PATH}/${species}_${grid.res.toString()}.geojson`,
        },
      },
    ]
  })
})

fs.writeFileSync(QGIS_BATCH, JSON.stringify(batch))
