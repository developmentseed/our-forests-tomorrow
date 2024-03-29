// Constants shared by node scripts and frontend
const BASE_ABS_PATH = '/Users/erik/Work/eu-trees4f-viz'
export const GEOJSON_ABS_PATH = `${BASE_ABS_PATH}/out/geojson`
export const STATS_ABS_PATH = `${BASE_ABS_PATH}/out/stats`
export const EUTREES4F_DATASET_ABS_PATH = `${BASE_ABS_PATH}/in/EU-Trees4F_dataset/ens_sdms`
export const SPECIES_META_MANUAL = './in/species_meta_manual.json'
export const SPECIES = './out/species.json'
export const SPECIES_DATA = './public/species_data.json'
export const SPECIES_MEDIA = './out/species_media.json'
export const SPECIES_IMAGES = './out/img/species'
export const QGIS_BATCH_MAIN = './out/qgis/eu-trees4f.batch.json'
export const QGIS_BATCH_EXTENTS = './out/qgis/eu-trees4f-extents.batch.json'
export const QGIS_BATCH_STATS = './out/qgis/stats.batch.json'
export const PBF = './out/pbf'
export const STATS = './out/stats'
export const DALL_E = './out/dall-e'
export const IN = 'in'
export const GEOJSON = 'out/geojson'
export const BASEMAP_COUNTRIES = 'basemap_countries'
export const BASEMAP_COUNTRIES_SRC = 'gadm_countries_custom.geojson'
export const BASEMAP_REGIONS = 'basemap_regions'
export const BASEMAP_REGIONS_SRC = 'gadm_regions_custom.geojson'
export const STATS_FINAL = './public/stats.json'
export const SIMPLIFIED_REGIONS = './public/simplified_regions.geojson'
export const GD_DATA = './public/gd.json'
export const RCP = '85'
export const RCPS = ['45', '85']

export const SPECIES_WHITELIST = [
  'Abies_alba',
  'Acer_campestre',
  'Acer_opalus',
  'Acer_platanoides',
  'Acer_pseudoplatanus',
  'Alnus_glutinosa',
  'Alnus_incana',
  'Arbutus_unedo',
  'Aria_edulis',
  'Betula_pendula',
  'Betula_pubescens',
  'Borkhausenia_intermedia',
  'Carpinus_betulus',
  'Carpinus_orientalis',
  'Castanea_sativa',
  'Celtis_australis',
  'Ceratonia_siliqua',
  'Cormus_domestica',
  'Corylus_avellana',
  'Cupressus_sempervirens',
  'Fagus_sylvatica',
  'Fraxinus_angustifolia',
  'Fraxinus_excelsior',
  'Fraxinus_ornus',
  'Juglans_regia',
  'Juniperus_thurifera',
  'Larix_decidua',
  'Laurus_nobilis',
  'Malus_sylvestris',
  'Olea_europaea',
  'Ostrya_carpinifolia',
  'Picea_abies',
  'Pinus_brutia',
  'Pinus_cembra',
  'Pinus_halepensis',
  'Pinus_nigra',
  'Pinus_pinaster',
  'Pinus_pinea',
  'Pinus_sylvestris',
  'Pistacia_lentiscus',
  'Pistacia_terebinthus',
  'Populus_alba',
  'Populus_nigra',
  'Populus_tremula',
  'Prunus_avium',
  'Prunus_padus',
  'Pyrus_communis',
  'Quercus_cerris',
  'Quercus_coccifera',
  'Quercus_faginea',
  'Quercus_frainetto',
  'Quercus_ilex',
  'Quercus_petraea',
  'Quercus_pubescens',
  'Quercus_pyrenaica',
  'Quercus_robur',
  'Quercus_suber',
  'Robinia_pseudoacacia',
  'Salix_alba',
  'Sorbus_aucuparia',
  'Taxus_baccata',
  'Tilia_cordata',
  'Tilia_platyphyllos',
  'Torminalis_glaberrima',
  'Ulmus_glabra',
  'Ulmus_laevis',
  'Ulmus_minor',
]

export const CONIFERS = [
  'Abies_alba',
  'Cupressus_sempervirens',
  'Juniperus_thurifera',
  'Larix_decidua',
  'Picea_abies',
  'Pinus_brutia',
  'Pinus_cembra',
  'Pinus_halepensis',
  'Pinus_nigra',
  'Pinus_pinaster',
  'Pinus_pinea',
  'Pinus_sylvestris',
  'Taxus_baccata'
]

export const GRIDS = [
  // { res: 80, minZoom: 0, maxZoom: 1 },
  // { res: 40, minZoom: 2, maxZoom: 3 },
  { res: 20, minZoom: 4, maxZoom: 5 },
  { res: 10, minZoom: 6, maxZoom: 8 },
]

export const SUPPORTED_LANGUAGES = ['en', 'fr', 'es']
