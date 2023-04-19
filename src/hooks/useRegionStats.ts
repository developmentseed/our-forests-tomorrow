import { useMemo } from 'react'
import useCoreData from '../hooks/useCoreData'
import useRegionData from './useRegionData'

function useRegionStats() {
  const region = useRegionData()
  const { stats } = useCoreData()

  return useMemo(() => {
    if (!stats) return null
    return Object.fromEntries(
      Object.entries(stats).map(([spc, spcStats]) => {
        const id = region.GID_1 || region.GID_0
        const spcStatsForRegion = spcStats[id]
        return [spc, spcStatsForRegion]
      })
    )
  }, [region, stats])
}
export default useRegionStats
