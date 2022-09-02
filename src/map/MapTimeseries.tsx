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

const W = 250
const H = 70

export type MapTimeseriesProps = {
  features?: Feature[]
  mainColor: number[]
}

function MapTimeseries({ features, mainColor }: MapTimeseriesProps) {
  const [timeStep, setTimeStep] = useAtom(timeStepAtom)
  // const numFeatures = features?.length || 0
  const timeseriesData = useMemo(() => {
    if (!features) return {}
    const featureCellTypesIndices = features.map((f) => {
      return TIME_STEPS.map((t) => {
        const type = getCellTypeAtTimeStep(f as any, t)
        return type
      })
    })

    const timeseriesData = Object.fromEntries(
      TIME_STEPS.map((t, i) => {
        const values = [
          featureCellTypesIndices.reduce((prev, cur) => {
            return cur[i] === CellTypeEnum.Decolonized ? prev + 1 : prev
          }, 0),
          featureCellTypesIndices.reduce((prev, cur) => {
            return cur[i] === CellTypeEnum.Stable ? prev + 1 : prev
          }, 0),
          featureCellTypesIndices.reduce((prev, cur) => {
            return cur[i] === CellTypeEnum.Suitable ? prev + 1 : prev
          }, 0),
        ]
        if (t === '2005') return [t, values[1]]
        return [t, values]
      })
    )

    return timeseriesData
  }, [features])

  return (
    <Fragment>
      <Timeseries
        data={timeseriesData}
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
