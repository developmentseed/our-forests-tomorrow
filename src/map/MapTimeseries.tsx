import { TIME_STEPS } from '../constants'
import Timeseries from '../components/Timeseries'
import { useAtom, useAtomValue } from 'jotai'
import { introCompletedAtom, introStepAtom, timeStepAtom } from '../atoms'
import useTimeseriesLayout from '../hooks/useTimeseriesLayout'
import {
  MapTimeseriesWrapper,
  TimestepButton,
  TimestepNav,
} from './MapTimeseries.styled'
import { ValuesByYear } from '../types'
import { IntroStepEnum } from '../intro/Intro'

const W = 250
const H = 70

export type MapTimeseriesProps = {
  timeseriesData: ValuesByYear | null
  mainColor: number[]
}

function MapTimeseries({ timeseriesData, mainColor }: MapTimeseriesProps) {
  const [timeStep, setTimeStep] = useAtom(timeStepAtom)
  // const numFeatures = features?.length || 0
  const layoutData = useTimeseriesLayout(timeseriesData, {
    width: W,
    height: H,
  })
  const introStep = useAtomValue(introStepAtom)
  const introCompleted = useAtomValue(introCompletedAtom)

  if (!timeseriesData) return null

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
          <TimestepButton
            selected={year === timeStep}
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
            <span>{year}</span>
          </TimestepButton>
        ))}
      </TimestepNav>
    </MapTimeseriesWrapper>
  )
}

export default MapTimeseries
