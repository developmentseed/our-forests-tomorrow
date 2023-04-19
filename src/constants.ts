import { TimeStep } from './types'

import { ViewState } from 'react-map-gl'

export const GEOTIFF_BBOX = [
  -18.9166666670000012, 27.0833333330000059, 49.9999999989999964,
  71.9166666658996405,
]

export const EUROPE_BBOX = [-10, 40, 30, 55]

export const CENTER = [
  (GEOTIFF_BBOX[0] + GEOTIFF_BBOX[2]) / 2,
  (GEOTIFF_BBOX[1] + GEOTIFF_BBOX[3]) / 2,
]
// export const CENTER = [-20, 50]

export const MAP_DEFAULT_VIEWPORT: ViewState = {
  longitude: CENTER[0],
  latitude: CENTER[1],
  zoom: 3,
  pitch: 0,
  bearing: 0,
  padding: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
}

export const MAX_ZOOM = 8

export const TIME_STEPS: TimeStep[] = ['2005', '2035', '2065', '2095']
export const CellTypesString: string[] = ['Decolonized', 'Stable', 'Suitable']

export enum CellTypeEnum {
  Decolonized,
  Stable,
  Suitable,
  Unknown,
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
    white: '#FFF',
    light: 'rgb(255,251,237)',
    lightFaded: 'rgba(255,251,237, .1)',
    dark: '#04232F',
    darkFaded: 'rgba(4,35,47,.5)',
    background: '#EBF9E6',
    darkgreen: '#0E817A',
    decolonized: '#c87474',
    stable: '#89dc6a',
    suitable: '#cdf872',
  },
  layout: {
    navHeight: '70px',
  },
  fonts: {
    serif: 'ITC Cheltenham Std Light Condensed, serif',
    serifBold: 'ITC Cheltenham Std Book Condensed, serif',
    sans: 'Montserrat, sans-serif',
  },
  fontSizes: {
    small: '0.7rem',
    normal: '.9rem',
    normalLineHeight: '1.8rem',
    subtitle: '1.6rem',
    subtitleLineHeight: '2rem',
    title: '2.4rem',
  },
  breakpoints: {
    mobile: '768px',
    laptop: '1024px',
  },
}

export const COLOR_BY_CELL_TYPE: Record<CellTypeEnum, string> = {
  [CellTypeEnum.Stable]: THEME.colors.stable,
  [CellTypeEnum.Decolonized]: THEME.colors.decolonized,
  [CellTypeEnum.Suitable]: THEME.colors.suitable,
  [CellTypeEnum.Unknown]: '#ff00ff',
}

export const GLOBAL_REGION_GID = 'global'