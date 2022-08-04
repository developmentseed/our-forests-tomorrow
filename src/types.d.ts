export type TimeStep = '2005' | '2035' | '2065' | '2095'
export type CellType = 'stable' | 'decolonized' | 'suitable' | 'unknown'
export type Cell = {
  properties: CellProps
}

export type CellProps = {
  id: number
} & Record<TimeStep, number>
