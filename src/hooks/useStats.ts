import { useMemo } from 'react'
import { CellTypeEnum, COUNTRIES_WITH_REGIONS_GIDS } from '../constants'
import {
  RegionFeature,
  StatsBySpecies,
  ValuesBySpeciesIDOrValuesByRegionGID,
  ValuesByYear,
} from '../types'

export function useStats(
  currentStats: ValuesBySpeciesIDOrValuesByRegionGID,
  keyType: 'byRegion' | 'bySpecies',
  year: number = 2005,
  order: 'asc' | 'desc' = 'desc',
  type: CellTypeEnum = CellTypeEnum.Stable
) {
  return useMemo(() => {
    if (!currentStats) return []
    const arr = Object.entries(currentStats)
    const ordered = arr.sort((a, b) => {
      const statsA = a[1]
      const statsB = b[1]

      const valueA = !statsA
        ? Number.NEGATIVE_INFINITY
        : year === 2005
        ? statsA[2005]
        : statsA[year][type]

      const valueB = !statsB
        ? Number.NEGATIVE_INFINITY
        : year === 2005
        ? statsB[2005]
        : statsB[year][type]

      if (order === 'desc') {
        if (!valueA) return 1
        if (!valueB) return -1
        return valueB - valueA
      }
      // order === 'asc'
      if (!valueA) return -1
      if (!valueB) return 1
      return valueA - valueB
    })
    if (keyType === 'byRegion') {
      const filtered = ordered.filter(
        ([GID]: [string, ValuesByYear]) =>
          !COUNTRIES_WITH_REGIONS_GIDS.includes(GID)
      )
      return filtered
    }
    return ordered
  }, [currentStats, keyType, order, type, year])
}

export function useAllSpeciesStatsForRegion(
  region: RegionFeature,
  stats: StatsBySpecies
) {
  return useMemo(() => {
    return Object.fromEntries(
      Object.entries(stats).map(([spc, spcStats]) => {
        const id = region.properties.GID_1 || region.properties.GID_0
        const spcStatsForRegion = spcStats[id]
        return [spc, spcStatsForRegion]
      })
    )
  }, [region, stats])
}
