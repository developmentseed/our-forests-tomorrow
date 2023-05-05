import {  useAtomValue } from 'jotai'
import {
  currentSpeciesAtom,
  introCompletedAtom,
  introStepAtom,
} from '../atoms'
import { MapTimeseriesWrapper } from './MapTimeseries.styled'
import { IntroStepEnum } from '../intro/Intro'
import useRegionStats from '../hooks/useRegionStats'
import InteractiveTimeseries from '../components/TimeseriesWithLegend'

function MapTimeseries() {
  const currentSpecies = useAtomValue(currentSpeciesAtom)
  const currentRegionStats = useRegionStats()
  const usingTimeseriesData = currentRegionStats?.[currentSpecies]

  const introStep = useAtomValue(introStepAtom)
  const introCompleted = useAtomValue(introCompletedAtom)

  if (!usingTimeseriesData) return null

  return (
    <MapTimeseriesWrapper
      visible={introCompleted || introStep >= IntroStepEnum.Timesteps}
    >
      <InteractiveTimeseries />
    </MapTimeseriesWrapper>
  )
}

export default MapTimeseries
