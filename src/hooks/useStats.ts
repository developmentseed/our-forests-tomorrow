import { useMemo } from 'react'
import { CellTypeEnum, COUNTRIES_WITH_REGIONS_GIDS } from '../constants'
import { ValuesByRegionGID, ValuesByYear } from '../types'

export function useStatsByRegions(
  currentStats: ValuesByRegionGID,
  year: number = 2005,
  order: 'asc' | 'desc' = 'desc',
  type: CellTypeEnum = CellTypeEnum.Stable
) {
  return useMemo(() => {
    const arr = Object.entries(currentStats)
    const ordered = arr.sort((a, b) => {
      const values: { a?: number; b?: number } =
        year === 2005
          ? { a: a[1][2005], b: b[1][2005] }
          : { a: a[1][year][type], b: b[1][year][type] }
      if (order === 'desc') {
        if (!values.a) return 1
        if (!values.b) return -1
        return values.b - values.a
      }
      // order === 'asc'
      if (!values.a) return -1
      if (!values.b) return 1
      return values.a - values.b
    })
    const filtered = ordered.filter(
      ([GID]: [string, ValuesByYear]) =>
        !COUNTRIES_WITH_REGIONS_GIDS.includes(GID)
    )
    return filtered
  }, [currentStats, order, type, year])
}
