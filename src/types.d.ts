import { Feature, Geometry } from 'geojson'

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
}

export type RegionFeature = Feature<Geometry, RegionProps>
