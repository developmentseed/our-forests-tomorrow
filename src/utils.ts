import { Cell, CellType, TimeStep } from './types'
import { CellTypeEnum } from './constants'

export const getCellTypeAtTimeStep = (
  d: Cell,
  timeStep: TimeStep
): CellType => {
  if (timeStep === '2005') {
    return d.properties.nat_2005 === 1 ? 'stable' : 'unknown'
  } else {
    // TODO return enum directly
    if (d.properties[`status_${timeStep}`] === CellTypeEnum.Suitable)
      return 'suitable'
    if (d.properties[`status_${timeStep}`] === CellTypeEnum.Decolonized)
      return 'decolonized'
    if (d.properties[`status_${timeStep}`] === CellTypeEnum.Stable)
      return 'stable'
  }
  return 'unknown'
}

export const deckColorToCss = (rgb: number[]) => `rgb(${rgb.join(', ')})`
