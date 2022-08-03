import { FUT_BY_TIME_STEP } from './constants'
import { Cell, CellType, TimeStep } from './types'

export const getCellTypeAtTimeStep = (
  d: Cell,
  timeStep: TimeStep
): CellType => {
  const nat = d.properties.nat_1
  if (timeStep === '2005') {
    if (nat === 1) {
      return 'stable'
    }
  } else {
    const probKey = FUT_BY_TIME_STEP[timeStep]
    const prob = d.properties[probKey]
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
