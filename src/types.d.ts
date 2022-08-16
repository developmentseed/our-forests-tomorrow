import { BBox, Feature, Geometry, Point } from 'geojson'
import { LayerProps } from '@deck.gl/core/typed'
import { MVTLayerProps, TileLayerProps } from '@deck.gl/layers/typed'

export type TimeStep = '2005' | '2035' | '2065' | '2095'
export type TimeStepFuture = '2035' | '2065' | '2095'
export type CellType = 'stable' | 'decolonized' | 'suitable' | 'unknown'
export type Cell = Feature<Point, CellProps>

export type CellProps = {
  id: number
  fid: number
  fid_2: number
  nat_2005: number
  prob_2035: number
  prob_2065: number
  prob_2095: number
  status_2035: number
  status_2065: number
  status_2095: number
}

export type RegionProps = {
  name_en: string
  name_fr: string
  bbox: BBox
  bboxPoly: Feature<Polygon>
  fid: number
  // COUNTRY: string
  // NAME_1: string
}

export type RegionFeature = Feature<Geometry, RegionProps>

export type LayerGenerator = {
  config: LayerProps
  overrides?: any
}

export type ValuesByCellType = [number, number, number]
export type ValuesByYear = Record<TimeStepFuture, ValuesByCellType> &
  Record<'2005', number> & { region?: Region }
export type ValuesByRegionGID = Record<string, ValuesByYear>
export type StatsBySpecies = Record<string, ValuesByRegionGID>
export type Region = {
  fid: number
  GID_0: string
  COUNTRY: string
  GID_1?: string
  NAME_1?: string
  TYPE_1?: string
  ENGTYPE_1?: string
  label: string
}

export type TimeseriesData = {
  t: number
  0: number
  1: number
  2: number
}
