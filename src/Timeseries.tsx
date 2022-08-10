import type { Feature } from 'geojson'
import { useMemo } from 'react'
import { COLOR_BY_CELL_TYPE, SPECIES_COLORS, TIME_STEPS } from './constants'
import { CellType } from './types'
import { getCellTypeAtTimeStep } from './utils'
import { area, stack, stackOffsetWiggle, curveCatmullRom } from 'd3-shape'
import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'

export type TimeseriesProps = {
  features?: Feature[]
  species: string
}

function Timeseries({ features, species }: TimeseriesProps) {
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
      const ys: any = {
        t: parseInt(t),
      }
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
    return [{ ...data[0], t: 1995 }, ...data, { ...data[3], t: 2105 }]
  }, [features])

  const maxY = useMemo(() => {
    const allYs = timeseriesData.map(
      (t) => t.stable + t.decolonized + t.suitable
    )
    return max(allYs)
  }, [timeseriesData])

  const pathContainers = useMemo(() => {
    const stackLayout = stack()
      .keys(['suitable', 'stable', 'decolonized'])
      .offset(stackOffsetWiggle)
    const series = stackLayout(timeseriesData)
    const scaleX = scaleLinear().domain([1995, 2105]).range([0, 250])
    const scaleY = scaleLinear().domain([0, maxY]).range([0, 80])

    const areaLayout = area()
      .x((d, i) => {
        return scaleX((d as any).data.t)
      })
      .y0((d) => {
        return scaleY(d[0])
      })
      .y1((d) => scaleY(d[1]))
      .curve(curveCatmullRom)

    const layouted = series.map((s) => {
      const type = s.key as CellType
      const color =
        type === 'stable' ? SPECIES_COLORS[species] : COLOR_BY_CELL_TYPE[type]
      return {
        path: areaLayout(s as any),
        color: color,
      }
    })

    return layouted
  }, [timeseriesData])

  return (
    <svg width={300} height={120}>
      {pathContainers.map((pathContainer, sublayerIndex) => (
        <g key={sublayerIndex} transform={`translate(0, 40)`}>
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
