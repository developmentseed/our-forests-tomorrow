import { TIME_STEPS } from '../constants'
import Timeseries from '../components/Timeseries'
import { useAtom, useAtomValue } from 'jotai'
import { currentSpeciesAtom, introCompletedAtom, introStepAtom, timeStepAtom } from '../atoms'
import useTimeseriesLayout from '../hooks/useTimeseriesLayout'
import { MapTimeseriesWrapper, TimestepNav } from './MapTimeseries.styled'
import { ValuesByYear } from '../types'
import { IntroStepEnum } from '../intro/Intro'
import { TimestepButton } from '../components/Button.styled'
import { TimestepColumn } from '../components/TimestepColumn.styled'
import useRegionStats from '../hooks/useRegionStats'

const W = 290
const H = 70

export type MapTimeseriesProps = {
  timeseriesData: ValuesByYear | null
  mainColor: number[]
}

function MapTimeseries({ timeseriesData, mainColor }: MapTimeseriesProps) {
  const [timeStep, setTimeStep] = useAtom(timeStepAtom)

  const currentSpecies = useAtomValue(currentSpeciesAtom)
  const currentRegionStats = useRegionStats()
  const usingTimeseriesData = timeseriesData ? timeseriesData : currentRegionStats?.[currentSpecies]

  // if (!usingTimeseriesData) return null

  // const numFeatures = features?.length || 0
  const layoutData = useTimeseriesLayout(usingTimeseriesData, {
    width: W,
    height: H,
    nodeMinHeightToBeVisible: 0,
  })
  const introStep = useAtomValue(introStepAtom)
  const introCompleted = useAtomValue(introCompletedAtom)

  if (!usingTimeseriesData) return null

  const { xs, nodeWidth } = layoutData
  const showTimeseries = introCompleted || introStep >= IntroStepEnum.Chart

  return (
    <MapTimeseriesWrapper
      visible={introCompleted || introStep >= IntroStepEnum.Timesteps}
    >
      {showTimeseries && (
        <Timeseries layoutData={layoutData} width={W} height={H} />
      )}

      <TimestepNav>
        {TIME_STEPS.map((year, yi) => (
          <TimestepColumn
            key={yi}
            onMouseEnter={() => setTimeStep(year)}
            style={{
              left: xs?.[yi],
              width: `${nodeWidth}px`,
              height:
                introCompleted || introStep >= IntroStepEnum.Chart
                  ? H + 40
                  : 30,
            }}
          >
            <TimestepButton selected={year === timeStep}>{year}</TimestepButton>
          </TimestepColumn>
        ))}
      </TimestepNav>
    </MapTimeseriesWrapper>
  )
}

export default MapTimeseries
