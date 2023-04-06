import { useMemo } from 'react'
import { CellTypeEnum, COUNTRIES_WITH_REGIONS_GIDS } from '../constants'
import {
  Region,
  StatsBySpecies,
  TimeStepFuture,
  ValuesBySpeciesIDOrValuesByRegionGID,
  ValuesByYear,
} from '../types'

export function getStats(
  currentStats: ValuesBySpeciesIDOrValuesByRegionGID,
  keyType: 'byRegion' | 'bySpecies',
  year: number = 2005,
  order: 'asc' | 'desc' = 'desc',
  type: CellTypeEnum = CellTypeEnum.Stable
) {
  if (!currentStats) return []
  const arr = Object.entries(currentStats)
  const ordered = arr.sort((a, b) => {
    const statsA = a[1]
    const statsB = b[1]

    const valueA = !statsA
      ? Number.NEGATIVE_INFINITY
      : year === 2005
      ? statsA[2005]
      : statsA[year.toString() as TimeStepFuture][type]

    const valueB = !statsB
      ? Number.NEGATIVE_INFINITY
      : year === 2005
      ? statsB[2005]
      : statsB[year.toString() as TimeStepFuture][type]

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

  // Filter out elements with no regions
  const filteredRealRegions = ordered.filter(
    (d) => d[1] && (d[1] as any).region
  )

  // Filter out countries with regions
  let filteredStandloneRegions: [string, ValuesByYear][] = filteredRealRegions
  if (keyType === 'byRegion') {
    filteredStandloneRegions = filteredRealRegions.filter(
      ([GID]: [string, ValuesByYear]) =>
        !COUNTRIES_WITH_REGIONS_GIDS.includes(GID)
    )
  }
  // FIlter out zero values
  const filteredHasValueForType = filteredStandloneRegions.filter(
    ([key, value]) => {
      if (year === 2005) return value[2005] && value[2005] > 0
      const valueForYear = value[year.toString() as TimeStepFuture][type]
      return valueForYear && valueForYear > 0
    }
  )

  const withLabels = filteredHasValueForType.map((entry) => [
    entry[0],
    {
      ...entry[1],
      label: keyType === 'bySpecies' ? entry[0] : entry[1].region?.label, // TODO this is species id, grab name?,
    },
  ])
  return withLabels
}

export function useAllSpeciesStatsForRegion(
  region: Region | null,
  stats: StatsBySpecies | null
) {
  return useMemo(() => {
    if (!stats || !region) return null
    return Object.fromEntries(
      Object.entries(stats).map(([spc, spcStats]) => {
        const id = region.GID_1 || region.GID_0
        const spcStatsForRegion = spcStats[id]
        return [spc, spcStatsForRegion]
      })
    )
  }, [region, stats])
}
