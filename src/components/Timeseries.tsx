import { Fragment, useMemo } from 'react'
import { TimeStep, ValuesByCellType, ValuesByYear } from '../types'
import { CellTypeEnum, COLOR_BY_CELL_TYPE, TIME_STEPS } from '../constants'
import { area, stack, stackOffsetWiggle, curveCatmullRom } from 'd3-shape'
import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import { deckColorToCss } from '../utils'
import SVGHatchPattern from './SVGHatchPattern'

type TimeseriesLayoutParams = {
  width: number
  height: number
  nodeWidth?: number
  nodeMaxHeight?: number
  nodeMinHeight?: number
  nodeMinHeightToBeVisible?: number
  mainColor?: number[]
}

function useTimeseriesLayout(
  data: ValuesByYear,
  params?: TimeseriesLayoutParams
) {
  const {
    width = 250,
    height = 120,
    nodeWidth = 50,
    nodeMaxHeight = 30,
    nodeMinHeight = 2,
    nodeMinHeightToBeVisible = 1,
    mainColor = [0, 255, 0],
  } = params || {}
  if (!Object.keys(data).length) return { nodes: [], links: [] }

  const xNodeSpacing = (width - 4 * nodeWidth) / 3
  const xs = []

  const getFill = (step: TimeStep, type: CellTypeEnum) => {
    if (step === '2005' || type === CellTypeEnum.Stable)
      return deckColorToCss(mainColor)
    else if (type === CellTypeEnum.Suitable) return 'url(#diagonalHatch)'
    else return deckColorToCss(COLOR_BY_CELL_TYPE[type])
  }

  // Compute scales
  const allValues = Object.entries(data)
    .flatMap(([year, values]: any) => {
      if (isNaN(parseInt(year))) return []
      if (year === '2005') return [[values]]
      return [values]
    })
    .flat()
  const maxValue = max(allValues)
  const scaleY = scaleLinear().domain([0, maxValue]).range([0, nodeMaxHeight])
  const clampedScaleY = (value: number) =>
    Math.max(nodeMinHeight, scaleY(value))

  // Eliminate very thin branches??

  // Compute basic node data
  let nodes: any[] = []
  for (let i = 3; i >= 0; i--) {
    const step = TIME_STEPS[i]
    const x1 = i * (nodeWidth + xNodeSpacing)
    const x2 = x1 + nodeWidth
    xs[i] = x1
    const values = data[step]
    let stepNodes: any[] = []
    if (step === '2005') {
      stepNodes.push({
        x1,
        x2,
        width: nodeWidth,
        // TODO
        height: clampedScaleY(values as number),
        type: CellTypeEnum.Stable,
        value: values,
        step,
        fill: getFill(step, CellTypeEnum.Stable),
      })
    } else {
      const futureValues = values as ValuesByCellType
      ;[
        CellTypeEnum.Suitable,
        CellTypeEnum.Stable,
        CellTypeEnum.Decolonized,
      ].forEach((type) => {
        const value = futureValues[type]
        // TODO instead of 10 use a min value in px/when scale applied
        if (value && scaleY(value) > nodeMinHeightToBeVisible) {
          stepNodes.push({
            x1,
            x2,
            width: nodeWidth,
            // TODO
            height: clampedScaleY(value),
            type,
            value,
            step,
            fill: getFill(step, type),
          })
        }
      })
    }
    const allNodesHeight = stepNodes.reduce(
      (prev, current) => prev + current.height,
      0
    )
    const yStepNodesSpacing = (height - allNodesHeight) / (stepNodes.length - 1)

    // TODO across all steps??
    const maxTypesNum = 3

    // Compute Ys
    let yCur = 0
    stepNodes = stepNodes.map((stepNode, yi) => {
      let y1, y2
      if (stepNodes.length === maxTypesNum) {
        // Full vertically, spread across height
        y1 = yCur
        y2 = yCur + stepNode.height
        yCur = y2 + yStepNodesSpacing
      } else {
        // align in the middle
        const yMid = (yi + 1) * (height / (stepNodes.length + 1))
        y1 = yMid - stepNode.height / 2
        y2 = yMid + stepNode.height / 2
      }

      return {
        ...stepNode,
        y1,
        y2,
      }
    })
    nodes = [...nodes, stepNodes]
  }

  // Compute links
  const links: any[] = []
  nodes.forEach((stepNodes, stepIndex) => {
    stepNodes.forEach((node: any) => {
      if (node.step !== '2005') {
        const prevStepNodes = nodes[stepIndex + 1]
        const prevStepNodeSameType = prevStepNodes.find(
          (n: any) => n.type === node.type
        )
        const prevStepNodeStable = prevStepNodes.find(
          (n: any) => n.type === CellTypeEnum.Stable
        )
        const prevNode = prevStepNodeSameType || prevStepNodeStable
        if (prevNode) {
          const l: any = {
            x1: prevNode.x2,
            x2: node.x1,
            y1Top: prevNode.y1,
            y2Top: node.y1,
            y1Bottom: prevNode.y2,
            y2Bottom: node.y2,
            fill: getFill(node.step, node.type),
          }

          const cWidth = xNodeSpacing * 0.5
          const cTop1 = { x: l.x1 + cWidth, y: l.y1Top }
          const cTop2 = { x: l.x2 - cWidth, y: l.y2Top }
          const cBottom1 = { x: l.x1 + cWidth, y: l.y1Bottom }
          const cBottom2 = { x: l.x2 - cWidth, y: l.y2Bottom }
          // l.d = `M ${l.x1} ${l.y1} L ${l.x2} ${l.y2}`

          if (node.type === prevNode.type) {
            l.d = `
              M ${l.x1} ${l.y1Top}
              C ${cTop1.x} ${cTop1.y}, ${cTop2.x} ${cTop2.y}, ${l.x2} ${l.y2Top}
              L ${l.x2} ${l.y2Bottom}
              C ${cBottom2.x} ${cBottom2.y}, ${cBottom1.x} ${cBottom1.y}, ${l.x1} ${l.y1Bottom}
              Z
            `
          } else if (node.type === CellTypeEnum.Suitable) {
            l.d = `
              M ${l.x1} ${l.y1Top}
              C ${cTop1.x} ${cTop1.y}, ${cTop2.x} ${cTop2.y}, ${l.x2} ${l.y2Top}
              L ${l.x2} ${l.y2Bottom}
              C ${cBottom2.x} ${cBottom2.y}, ${cTop1.x} ${cTop1.y}, ${l.x1} ${l.y1Top}
              Z
            `
          } else if (node.type === CellTypeEnum.Decolonized) {
            l.d = `
              M ${l.x1} ${l.y1Bottom}
              C ${cBottom1.x} ${cBottom1.y}, ${cTop2.x} ${cTop2.y}, ${l.x2} ${l.y2Top}
              L ${l.x2} ${l.y2Bottom}
              C ${cBottom2.x} ${cBottom2.y},  ${cBottom1.x} ${cBottom1.y}, ${l.x1} ${l.y1Bottom}
              Z
            `
          }
          links.push(l)
        }
      }
    })
  })

  return {
    nodes: nodes.flat(),
    links,
    xs,
    nodeWidth,
  }
}

type TimeseriesProps = {
  data: ValuesByYear
  mainColor: number[]
  width: number
  height: number
}

function Timeseries({ data, mainColor, width, height }: TimeseriesProps) {
  const { nodes, links, xs, nodeWidth } = useTimeseriesLayout(data, {
    width,
    height,
    mainColor,
  })
  console.log(data, nodes, links)

  const toArray = useMemo(() => {
    return Object.entries(data).flatMap(([year, values]: any) => {
      if (isNaN(parseInt(year))) return []
      if (year === '2005') return [[0, values, 0]]
      return [values]
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
    const scaleY = scaleLinear().domain([0, maxY]).range([0, height])

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
  }, [paddedSeries, maxY, height, mainColor, width])
  return (
    <Fragment>
      <svg width={width} height={height} style={{ marginBottom: '20px' }}>
        {pathContainers.map((pathContainer, sublayerIndex) => (
          <g key={sublayerIndex} transform={`translate(0, 0)`}>
            <path
              d={pathContainer.path || ''}
              fill={deckColorToCss(pathContainer.color)}
            />
          </g>
        ))}
      </svg>
      <div style={{ position: 'relative', marginBottom: '30px' }}>
        <svg
          width={width}
          height={height}
          // style={{ border: '1px solid rgba(0,0,0,.1)' }}
        >
          <SVGHatchPattern color={deckColorToCss(mainColor)} hatchWidth={1.5} />
          {nodes.map((node) => (
            <rect
              width={node.width}
              height={node.height}
              x={node.x1}
              y={node.y1}
              fill={node.fill}
              // stroke="black"
            ></rect>
          ))}

          {links.map((l) => (
            <path d={l.d} fill={l.fill} />
          ))}
        </svg>
        <div
          style={{
            position: 'absolute',
            top: 0,
          }}
        >
          {TIME_STEPS.map((year, yi) => (
            <div
              style={{
                position: 'absolute',
                left: xs?.[yi],
                width: `${nodeWidth}px`,
                height: height + 30,
                border: '0.1px dashed rgb(0,0,0,.2)',
                display: 'flex',
                alignItems: 'end',
              }}
            >
              {year}
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  )
}

export default Timeseries
