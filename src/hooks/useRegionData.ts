import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { currentRegionAtom } from '../atoms'
import useCoreData from '../hooks/useCoreData'
import { Region } from '../types'

function useRegionData() {
  const currentRegion = useAtomValue(currentRegionAtom)

  const { regions } = useCoreData()

  const currentRegionData = useMemo(
    () =>
      regions?.find(
        (r) => r.GID_0 === currentRegion || r.GID_1 === currentRegion
      ),
    [currentRegion, regions]
  )
  return currentRegionData as Region
}
export default useRegionData
