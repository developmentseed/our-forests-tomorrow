import { Cell, CellType, TimeStep } from './types'

export const getCellTypeAtTimeStep = (
  d: Cell,
  timeStep: TimeStep
): CellType => {
  const nat = d.properties['2005']
  if (timeStep === '2005') {
    if (nat === 1) {
      return 'stable'
    }
  } else {
    const prob = d.properties[timeStep]
    if (nat === 1) {
      if (prob < 500) {
        return 'decolonized'
      } else {
        return 'stable'
      }
    } else {
      if (prob > 500) {
        return 'suitable'
      }
    }
  }
  return 'unknown'
}

export const deckColorToCss = (rgb: number[]) => `rgb(${rgb.join(', ')})`
