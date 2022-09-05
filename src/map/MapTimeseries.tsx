import type { Feature } from 'geojson'
import { Dispatch, Fragment, SetStateAction, useMemo } from 'react'
import { CellTypeEnum, TIME_STEPS } from '../constants'
import { TimeStep } from '../types'
import { getCellTypeAtTimeStep } from '../utils'
import './MapTimeseries.css'
import cx from 'classnames'
import Timeseries from '../components/Timeseries'
import { useAtom } from 'jotai'
import { timeStepAtom } from '../atoms'
import useTimeseriesData from '../hooks/useTimeseriesData'
import useTimeseriesLayout from '../hooks/useTimeseriesLayout'

const W = 250
const H = 70

export type MapTimeseriesProps = {
  features?: Feature[]
  mainColor: number[]
}

function MapTimeseries({ features, mainColor }: MapTimeseriesProps) {
  const [timeStep, setTimeStep] = useAtom(timeStepAtom)
  // const numFeatures = features?.length || 0
  const timeseriesData = useTimeseriesData(features)
  const layoutData = useTimeseriesLayout(timeseriesData, {
    width: W,
    height: H,
    mainColor,
  })

  if (!timeseriesData) return null

  return (
    <Fragment>
      <Timeseries
        layoutData={layoutData}
        mainColor={mainColor}
        width={W}
        height={H}
      />

      <div className="axis">
        {['2005', '2035', '2065', '2095'].map((y) => (
          <button
            className={cx({ selected: y === timeStep })}
            onMouseEnter={() => setTimeStep(y as TimeStep)}
            key={y}
          >
            {y}
          </button>
        ))}
      </div>
    </Fragment>
  )
}

export default MapTimeseries
