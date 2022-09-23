import { useMemo } from 'react'
import { CellTypeEnum, TIME_STEPS } from '../constants'
import { ValuesByYear } from '../types'
import { getCellTypeAtTimeStep } from '../utils'

function useTimeseriesData(features: any) {
  return useMemo(() => {
    if (!features) return null
    const featureCellTypesIndices = features.map((f: any) => {
      return TIME_STEPS.map((t) => {
        const type = getCellTypeAtTimeStep(f as any, t)
        return type
      })
    })

    const timeseriesData = Object.fromEntries(
      TIME_STEPS.map((t, i) => {
        const values = [
          featureCellTypesIndices.reduce((prev: any, cur: any) => {
            return cur[i] === CellTypeEnum.Decolonized ? prev + 1 : prev
          }, 0),
          featureCellTypesIndices.reduce((prev: any, cur: any) => {
            return cur[i] === CellTypeEnum.Stable ? prev + 1 : prev
          }, 0),
          featureCellTypesIndices.reduce((prev: any, cur: any) => {
            return cur[i] === CellTypeEnum.Suitable ? prev + 1 : prev
          }, 0),
        ]
        if (t === '2005') return [t, values[1]]
        return [t, values]
      })
    )

    return timeseriesData as ValuesByYear
  }, [features])
}

export default useTimeseriesData
