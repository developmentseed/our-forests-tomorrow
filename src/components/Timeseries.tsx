import { Fragment } from 'react'
import { TIME_STEPS } from '../constants'
import { deckColorToCss } from '../utils'
import SVGHatchPattern from './SVGHatchPattern'
import { TimeseriesLayoutData } from '../hooks/useTimeseriesLayout'

export type TimeseriesProps = {
  layoutData: TimeseriesLayoutData
  mainColor: number[]
  width: number
  height: number
}

function Timeseries({ layoutData, mainColor, width, height }: TimeseriesProps) {
  const { nodes, links, xs, nodeWidth } = layoutData
  // console.log(data, nodes, links)

  // const toArray = useMemo(() => {
  //   return Object.entries(data).flatMap(([year, values]: any) => {
  //     if (isNaN(parseInt(year))) return []
  //     if (year === '2005') return [[0, values, 0]]
  //     return [values]
  //   })
  // }, [data]) as number[][]

  // const maxY = useMemo(() => {
  //   const allYs = toArray.map((t) => t[0] + t[1] + t[2])
  //   return max(allYs) as number
  // }, [toArray])

  // const paddedSeries = useMemo(() => {
  //   if (!toArray.length) return []
  //   return [toArray[0], ...toArray, toArray[3]]
  // }, [toArray]) as number[][]

  // const pathContainers = useMemo(() => {
  //   if (!paddedSeries.length) return []
  //   const stackLayout = stack()
  //     .keys([2, 1, 0] as any)
  //     .offset(stackOffsetWiggle)
  //   const series = stackLayout(paddedSeries as any)
  //   const scaleX = scaleLinear().domain([1995, 2105]).range([0, width])
  //   const scaleY = scaleLinear().domain([0, maxY]).range([0, height])

  //   const areaLayout = area()
  //     .x((_, i) => {
  //       if (i === 0) return scaleX(1995)
  //       else if (i === 5) return scaleX(2105)
  //       else return scaleX(parseInt(TIME_STEPS[i - 1]))
  //     })
  //     .y0((d) => {
  //       return scaleY(d[0])
  //     })
  //     .y1((d) => scaleY(d[1]))
  //     .curve(curveCatmullRom)
  //   const layouted = series.map((s) => {
  //     const type = s.key as unknown as CellTypeEnum
  //     const color =
  //       type === CellTypeEnum.Stable ? mainColor : COLOR_BY_CELL_TYPE[type]
  //     return {
  //       path: areaLayout(s as any),
  //       color: color,
  //     }
  //   })

  //   return layouted
  // }, [paddedSeries, maxY, height, mainColor, width])
  return (
    <Fragment>
      {/* <svg width={width} height={height} style={{ marginBottom: '20px' }}>
        {pathContainers.map((pathContainer, sublayerIndex) => (
          <g key={sublayerIndex} transform={`translate(0, 0)`}>
            <path
              d={pathContainer.path || ''}
              fill={deckColorToCss(pathContainer.color)}
            />
          </g>
        ))}
      </svg> */}
      <div style={{ position: 'relative' }}>
        <svg
          width={width}
          height={height}
          // style={{ border: '1px solid rgba(0,0,0,.1)' }}
        >
          <defs>
            <SVGHatchPattern
              color={deckColorToCss(mainColor)}
              hatchWidth={1.5}
            />
          </defs>

          {nodes.map((node, ni) => (
            <rect
              key={`node_${ni}`}
              width={node.width}
              height={node.height}
              x={node.x1}
              y={node.y1}
              fill={node.fill}
              // stroke="black"
            ></rect>
          ))}

          {links.map((l, li) => (
            <path key={`link_${li}`} d={l.d} fill={l.fill} />
          ))}
        </svg>
      </div>
    </Fragment>
  )
}

export default Timeseries
