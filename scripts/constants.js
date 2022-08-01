module.exports = {
  GEOJSON_ABS_PATH: '/Users/erik/Work/eu-trees4f/out/geojson',
  EUTREES4F_DATASET_ABS_PATH:
    '/Users/erik/Work/eu-trees4f/in/EU-Trees4F_dataset/ens_sdms',
  SPECIES: './out/species.json',
  QGIS_BATCH: './out/qgis/batch.json',
  PBF: './out/pbf',
  RCP: '85',
  SPECIES_WHITELIST: ['Fraxinus_excelsior', 'Quercus_ilex'],
  GRIDS: [
    { res: 80000, minZoom: 0, maxZoom: 2 },
    { res: 40000, minZoom: 3, maxZoom: 4 },
    { res: 20000, minZoom: 5, maxZoom: 6 },
    // { res: 10000, minZoom: 7, maxZoom: 8 },
  ],
}
