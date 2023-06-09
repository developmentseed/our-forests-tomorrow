import { TIME_STEPS } from '../constants'
import Timeseries from './Timeseries'
import { useAtom, useAtomValue } from 'jotai'
import {
  currentSpeciesAtom,
  introCompletedAtom,
  introStepAtom,
  timeStepAtom,
} from '../atoms'
import useTimeseriesLayout from '../hooks/useTimeseriesLayout'
import { TimestepNav } from './TimeseriesWithLegend.styled'
import { IntroStepEnum } from '../intro/Intro'
import { TimestepButton } from './Button.styled'
import { TimestepColumn } from './TimestepColumn.styled'
import useRegionStats from '../hooks/useRegionStats'
import { Fragment } from 'react'

const W = 290
const H = 70

function InteractiveTimeseries() {
  const [timeStep, setTimeStep] = useAtom(timeStepAtom)

  const currentSpecies = useAtomValue(currentSpeciesAtom)
  const currentRegionStats = useRegionStats()
  const usingTimeseriesData = currentRegionStats?.[currentSpecies]

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
    <div style={{ position: 'relative', marginBottom: '50px' }}>
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
    </div>
  )
}

export default InteractiveTimeseries
