import { useMemo } from 'react'
import { ValuesByYear } from '../types'
import { CellTypeEnum, COLOR_BY_CELL_TYPE, TIME_STEPS } from '../constants'
import { area, stack, stackOffsetWiggle, curveCatmullRom } from 'd3-shape'
import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import { deckColorToCss } from '../utils'

type TimeseriesProps = {
  data: ValuesByYear
  mainColor: number[]
  width: number
  height: number
}

function Timeseries({ data, mainColor, width, height }: TimeseriesProps) {
  const toArray = useMemo(() => {
    return Object.entries(data).map(([year, values]) => {
      if (year === '2005') return [0, values, 0]
      return values
    })
  }, [data]) as number[][]

  const maxY = useMemo(() => {
    const allYs = toArray.map((t) => t[0] + t[1] + t[2])
    return max(allYs) as number
  }, [toArray])

  const paddedSeries = useMemo(() => {
    if (!toArray.length) return []
    return [toArray[0], ...toArray, toArray[3]]
  }, [toArray]) as number[][]

  const pathContainers = useMemo(() => {
    if (!paddedSeries.length) return []
    const stackLayout = stack()
      .keys([2, 1, 0] as any)
      .offset(stackOffsetWiggle)
    const series = stackLayout(paddedSeries as any)
    const scaleX = scaleLinear().domain([1995, 2105]).range([0, width])
    const scaleY = scaleLinear().domain([0, maxY]).range([0, 80])

    const areaLayout = area()
      .x((_, i) => {
        if (i === 0) return scaleX(1995)
        else if (i === 5) return scaleX(2105)
        else return scaleX(parseInt(TIME_STEPS[i - 1]))
      })
      .y0((d) => {
        return scaleY(d[0])
      })
      .y1((d) => scaleY(d[1]))
      .curve(curveCatmullRom)
    const layouted = series.map((s) => {
      const type = s.key as unknown as CellTypeEnum
      const color =
        type === CellTypeEnum.Stable ? mainColor : COLOR_BY_CELL_TYPE[type]
      return {
        path: areaLayout(s as any),
        color: color,
      }
    })

    return layouted
  }, [paddedSeries, maxY, mainColor, width])
  return (
    <svg width={width} height={height}>
      {pathContainers.map((pathContainer, sublayerIndex) => (
        <g key={sublayerIndex} transform={`translate(0, 40)`}>
          <path
            d={pathContainer.path || ''}
            fill={deckColorToCss(pathContainer.color)}
          />
        </g>
      ))}
    </svg>
  )
}

export default Timeseries
