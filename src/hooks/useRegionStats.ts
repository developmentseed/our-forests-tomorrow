import useCoreData from '../hooks/useCoreData'
import { ValuesBySpeciesID } from '../types'
import useRegionData from './useRegionData'
import { useAllSpeciesStatsForRegion } from './useStats'

function useRegionStats() {
  const currentRegionData = useRegionData()
  const { stats } = useCoreData()
  const currentRegionStats: ValuesBySpeciesID | null =
    useAllSpeciesStatsForRegion(currentRegionData, stats)

  return currentRegionStats
}
export default useRegionStats
