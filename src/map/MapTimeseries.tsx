import type { Feature } from 'geojson'
import { TIME_STEPS } from '../constants'
import './MapTimeseries.css'
import Timeseries from '../components/Timeseries'
import { useAtom } from 'jotai'
import { timeStepAtom } from '../atoms'
import useTimeseriesData from '../hooks/useTimeseriesData'
import useTimeseriesLayout from '../hooks/useTimeseriesLayout'
import {
  MapTimeseriesWrapper,
  TimestepButton,
  TimestepNav,
} from './MapTimeseries.styled'
import { ValuesByYear } from '../types'

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
    mainColor,
  })

  if (!timeseriesData) return null

  const { xs, nodeWidth } = layoutData

  return (
    <MapTimeseriesWrapper>
      <Timeseries
        layoutData={layoutData}
        mainColor={mainColor}
        width={W}
        height={H}
      />

      <TimestepNav>
        {TIME_STEPS.map((year, yi) => (
          <TimestepButton
            selected={year === timeStep}
            key={yi}
            onMouseEnter={() => setTimeStep(year)}
            style={{
              left: xs?.[yi],
              width: `${nodeWidth}px`,
              height: H + 40,
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
