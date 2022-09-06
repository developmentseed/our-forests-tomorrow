import { Cell, TimeStep } from './types'
import { CellTypeEnum } from './constants'

export const getCellTypeAtTimeStep = (
  d: Cell,
  timeStep: TimeStep
): CellTypeEnum => {
  if (timeStep === '2005') {
    return d.properties.nat_2005 === 1
      ? CellTypeEnum.Stable
      : CellTypeEnum.Unknown
  } else {
    return d.properties[`status_${timeStep}`]
  }
}

export const deckColorToCss = (rgb: number[]) => `rgb(${rgb.join(', ')})`

export const formatLatin = (speciesId: string) => speciesId.replace('_', ' ')
