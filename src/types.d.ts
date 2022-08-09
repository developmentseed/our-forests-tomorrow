import { Feature, Geometry } from 'geojson'
import { LayerProps } from '@deck.gl/core/typed'
import { MVTLayerProps, TileLayerProps } from '@deck.gl/layers/typed'

export type TimeStep = '2005' | '2035' | '2065' | '2095'
export type CellType = 'stable' | 'decolonized' | 'suitable' | 'unknown'
export type Cell = {
  properties: CellProps
}

export type CellProps = {
  id: number
} & Record<TimeStep, number>

export type RegionProps = {
  name_en: string
  name_fr: string
  // COUNTRY: string
  // NAME_1: string
}

export type RegionFeature = Feature<Geometry, RegionProps>

export type LayerGenerator = {
  config: LayerProps
  overrides?: any
}
