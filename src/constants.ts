import { CellType, TimeStep } from './types'

import SPECIES from './species_detail.json'

export const GEOTIFF_BBOX = [
  -18.9166666670000012, 27.0833333330000059, 49.9999999989999964,
  71.9166666658996405,
]

export const CENTER = [
  (GEOTIFF_BBOX[0] + GEOTIFF_BBOX[2]) / 2,
  (GEOTIFF_BBOX[1] + GEOTIFF_BBOX[3]) / 2,
]

export const MAX_ZOOM = 8

export const TIME_STEPS: TimeStep[] = ['2005', '2035', '2065', '2095']

export const COLOR_BY_CELL_TYPE: Record<CellType, number[]> = {
  stable: [0, 150, 0],
  decolonized: [255, 0, 0],
  suitable: [0, 0, 255],
  unknown: [0, 0, 0, 0],
}

export const SPECIES_IDS = Object.keys(SPECIES)

export const SPECIES_COLORS = SPECIES_IDS.map(
  () =>
    `rgb(${Math.floor(150 * Math.random())}, ${
      200 + Math.floor(50 * Math.random())
    }, ${Math.floor(150 * Math.random())})`
)
