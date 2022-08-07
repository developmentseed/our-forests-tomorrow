// Constants shared by ndoe scripts and frontend
export const GEOJSON_ABS_PATH = '/Users/erik/Work/eu-trees4f/out/geojson'
export const EUTREES4F_DATASET_ABS_PATH =
  '/Users/erik/Work/eu-trees4f/in/EU-Trees4F_dataset/ens_sdms'
export const SPECIES = './out/species.json'
export const SPECIES_DETAIL = './src/species_detail.json'
export const QGIS_BATCH = './out/qgis/batch.json'
export const PBF = './out/pbf'
export const IN = 'in'
export const GEOJSON = 'out/geojson'
export const BASEMAP_COUNTRIES = 'basemap_countries'
export const BASEMAP_COUNTRIES_SRC = 'ne_10m_admin_0_countries'
export const BASEMAP_REGIONS = 'basemap_regions'
export const BASEMAP_REGIONS_SRC = 'ne_10m_admin_1_states_provinces'
export const RCP = '85'
export const SPECIES_WHITELIST = [
  'Fraxinus_excelsior',
  'Quercus_ilex',
  'Alnus_glutinosa',
  'Arbutus_unedo',
  'Aria_edulis',
  'Olea_europaea',
  'Pinus_pinaster',
]
export const GRIDS = [
  { res: 80000, minZoom: 0, maxZoom: 2 },
  { res: 40000, minZoom: 3, maxZoom: 4 },
  { res: 20000, minZoom: 5, maxZoom: 6 },
  { res: 10000, minZoom: 7, maxZoom: 8 },
]
