import type { Feature } from 'geojson'
import { useMemo } from 'react'
import { COLOR_BY_CELL_TYPE, TIME_STEPS } from './constants'
import { CellType } from './types'
import { getCellTypeAtTimeStep } from './utils'
import { area, stack, stackOffsetSilhouette, curveCatmullRom } from 'd3-shape'
import { scaleLinear } from 'd3-scale'

export type TimeseriesProps = {
  features?: Feature[]
}

function Timeseries({ features }: TimeseriesProps) {
  // const numFeatures = features?.length || 0
  const timeseriesData = useMemo(() => {
    if (!features) return []
    const featureCellTypesIndices = features.map((f) => {
      return TIME_STEPS.map((t) => {
        const type = getCellTypeAtTimeStep(f as any, t)
        return type
      })
    })
    const data = TIME_STEPS.map((t, i) => {
      const ys: any = {}
      ys.stable = featureCellTypesIndices.reduce((prev, cur) => {
        return cur[i] === 'stable' ? prev + 1 : prev
      }, 0)
      ys.suitable = featureCellTypesIndices.reduce((prev, cur) => {
        return cur[i] === 'suitable' ? prev + 1 : prev
      }, 0)
      ys.decolonized = featureCellTypesIndices.reduce((prev, cur) => {
        return cur[i] === 'decolonized' ? prev + 1 : prev
      }, 0)
      return ys
    })
    return data
  }, [features])

  const pathContainers = useMemo(() => {
    const stackLayout = stack()
      .keys(['suitable', 'stable', 'decolonized'])
      .offset(stackOffsetSilhouette)
    const series = stackLayout(timeseriesData)
    const scaleX = scaleLinear().domain([0, 3]).range([0, 300])
    const scaleY = scaleLinear().domain([0, 10000]).range([0, 200])

    const areaLayout = area()
      .x((d, i) => {
        return scaleX(i)
      })
      .y0((d) => {
        return scaleY(d[0])
      })
      .y1((d) => scaleY(d[1]))
      .curve(curveCatmullRom)

    const layouted = series.map((s) => {
      return {
        path: areaLayout(s as any),
        color: COLOR_BY_CELL_TYPE[s.key as CellType],
      }
    })

    return layouted
  }, [timeseriesData])

  return (
    <svg width={300} height={200}>
      {pathContainers.map((pathContainer, sublayerIndex) => (
        <g key={sublayerIndex} transform={`translate(0, 100)`}>
          <path
            d={pathContainer.path || ''}
            fill={`rgb(${pathContainer.color[0]}, ${pathContainer.color[1]}, ${pathContainer.color[2]})`}
          />
        </g>
      ))}
    </svg>
  )
}

export default Timeseries
