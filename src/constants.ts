import { Fut, TimeStep } from './types'

export const GEOTIFF_BBOX = [
  -18.9166666670000012, 27.0833333330000059, 49.9999999989999964,
  71.9166666658996405,
]

export const CENTER = [
  (GEOTIFF_BBOX[0] + GEOTIFF_BBOX[2]) / 2,
  (GEOTIFF_BBOX[1] + GEOTIFF_BBOX[3]) / 2,
]

export const MAX_ZOOM = 8

export const FUT_BY_TIME_STEP: Record<TimeStep, Fut> = {
  '2005': 'nat_1',
  '2035': 'fut1_1',
  '2065': 'fut2_1',
  '2095': 'fut3_1',
}
