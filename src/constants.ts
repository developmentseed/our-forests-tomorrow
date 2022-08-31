import { TimeStep } from './types'

export const GEOTIFF_BBOX = [
  -18.9166666670000012, 27.0833333330000059, 49.9999999989999964,
  71.9166666658996405,
]

export const EUROPE_BBOX = [-10, 40, 30, 55]

export const CENTER = [
  (GEOTIFF_BBOX[0] + GEOTIFF_BBOX[2]) / 2,
  (GEOTIFF_BBOX[1] + GEOTIFF_BBOX[3]) / 2,
]

export const MAX_ZOOM = 8

export const TIME_STEPS: TimeStep[] = ['2005', '2035', '2065', '2095']

export enum CellTypeEnum {
  Decolonized,
  Stable,
  Suitable,
  Unknown,
}

export const COLOR_BY_CELL_TYPE: Record<CellTypeEnum, number[]> = {
  [CellTypeEnum.Stable]: [0, 150, 0],
  [CellTypeEnum.Decolonized]: [216, 46, 14],
  [CellTypeEnum.Suitable]: [0, 0, 255],
  [CellTypeEnum.Unknown]: [0, 0, 0, 0],
}

// > 100 000km2
export const COUNTRIES_WITH_REGIONS_GIDS = [
  'BEL',
  'BGR',
  'DEU',
  'ESP',
  'FIN',
  'FRA',
  'GBR',
  'GRC',
  'ITA',
  'NOR',
  'POL',
  'ROU',
  'SWE',
]

export const THEME = {
  colors: {
    light: '#FFFBED',
    dark: '#04232F',
    background: '#B0D7C1',
    decolonized: '#E22E59',
  },
  layout: {
    navHeight: '105px',
  },
  fonts: {
    serif: 'ITC Cheltenham Std Light Condensed, serif',
    serifBold: 'ITC Cheltenham Std Book Condensed, serif',
    sans: 'Montserrat, sans-serif',
  },
  mobile: '768px',
}
