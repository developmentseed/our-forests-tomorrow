import { TimeStep, ValuesByCellType, ValuesByYear } from '../types'
import { CellTypeEnum, COLOR_BY_CELL_TYPE, TIME_STEPS } from '../constants'
import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import { deckColorToCss } from '../utils'

type TimeseriesLayoutParams = {
  width: number
  height: number
  nodeWidth?: number
  nodeMaxHeight?: number
  nodeMinHeight?: number
  nodeMinHeightToBeVisible?: number
  mainColor?: number[]
}

type Node = {
  x1: number
  x2: number
  y1: number
  y2: number
  width: number
  height: number
  type: CellTypeEnum
  value: number
  step: TimeStep
  fill: string
}

type Link = {
  x1: number
  x2: number
  y1Top: number
  y2Top: number
  y1Bottom: number
  y2Bottom: number
  fill: string
  d: string
}

export type TimeseriesLayoutData = {
  nodes: Node[]
  links: Link[]
  xs: number[]
  nodeWidth: number
}

function useTimeseriesLayout(
  data?: ValuesByYear | null,
  params?: TimeseriesLayoutParams
): TimeseriesLayoutData {
  const {
    width = 250,
    height = 120,
    nodeWidth = 50,
    nodeMaxHeight = 30,
    nodeMinHeight = 2,
    nodeMinHeightToBeVisible = 1,
  } = params || {}
  if (!data || !Object.keys(data).length)
    return { nodes: [], links: [], xs: [], nodeWidth: 0 }

  const xNodeSpacing = (width - 4 * nodeWidth) / 3
  const xs = []

  const getFill = (
    step: TimeStep,
    type: CellTypeEnum,
    prevType?: CellTypeEnum
  ) => {
    if (prevType === CellTypeEnum.Stable && type === CellTypeEnum.Decolonized)
      return 'url(#gradStableToDecolonized)'
    else if (step === '2005' || type === CellTypeEnum.Stable)
      return deckColorToCss(COLOR_BY_CELL_TYPE[type])
    else if (type === CellTypeEnum.Suitable) return 'url(#hatch)'
    else return deckColorToCss(COLOR_BY_CELL_TYPE[type])
  }

  // Compute scales
  const allValues = Object.entries(data)
    .flatMap(([year, values]: [string, any]) => {
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
  let nodes: Node[][] = []
  for (let i = 3; i >= 0; i--) {
    const step = TIME_STEPS[i]
    const x1 = i * (nodeWidth + xNodeSpacing)
    const x2 = x1 + nodeWidth
    xs[i] = x1
    const values = data[step]
    let stepNodes: Node[] = []

    const types =
      step === '2005'
        ? [CellTypeEnum.Stable]
        : [CellTypeEnum.Suitable, CellTypeEnum.Stable, CellTypeEnum.Decolonized]

    types.forEach((type, ti) => {
      const value =
        step === '2005'
          ? (values as number)
          : (values as ValuesByCellType)[type]

      if (value && scaleY(value) > nodeMinHeightToBeVisible) {
        stepNodes.push({
          x1,
          x2,
          y1: NaN,
          y2: NaN,
          width: nodeWidth,
          height: clampedScaleY(value),
          type,
          value,
          step,
          fill: getFill(step, type),
        })
      }
    })

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

  const getLink = (
    node: Node,
    prevNode: Node,
    y1Top: number,
    y2Top: number,
    y1Bottom: number,
    y2Bottom: number
  ): Link => {
    const l: Link = {
      x1: prevNode.x2,
      x2: node.x1,
      y1Top,
      y2Top,
      y1Bottom,
      y2Bottom,
      fill: getFill(node.step, node.type, prevNode.type),
      d: '',
    }

    const cWidth = xNodeSpacing * 0.5
    const cTop1 = { x: l.x1 + cWidth, y: l.y1Top }
    const cTop2 = { x: l.x2 - cWidth, y: l.y2Top }
    const cBottom1 = { x: l.x1 + cWidth, y: l.y1Bottom }
    const cBottom2 = { x: l.x2 - cWidth, y: l.y2Bottom }

    l.d = `
          M ${l.x1} ${l.y1Top}
          C ${cTop1.x} ${cTop1.y}, ${cTop2.x} ${cTop2.y}, ${l.x2} ${l.y2Top}
          L ${l.x2} ${l.y2Bottom}
          C ${cBottom2.x} ${cBottom2.y}, ${cBottom1.x} ${cBottom1.y}, ${l.x1} ${l.y1Bottom}
          Z
            `
    return l
  }

  // Compute links
  const links: Link[] = []
  nodes.forEach((stepNodes, stepIndex) => {
    stepNodes.forEach((node) => {
      if (node.step !== '2005') {
        const prevStepNodes = nodes[stepIndex + 1]
        const prevStepNodeSameType = prevStepNodes.find(
          (n) => n.type === node.type
        )
        const prevStepNodeStable = prevStepNodes.find(
          (n) => n.type === CellTypeEnum.Stable
        )
        const currenStepNodeStable = stepNodes.find(
          (n) => n.type === CellTypeEnum.Stable
        )

        if (prevStepNodeSameType) {
          if (node.type === CellTypeEnum.Stable) {
            links.push(
              getLink(
                node,
                prevStepNodeSameType,
                prevStepNodeSameType.y1,
                node.y1,
                prevStepNodeSameType.y1 + node.height,
                node.y1 + node.height
              )
            )
          } else if (node.type === CellTypeEnum.Decolonized) {
            const offsetY =
              currenStepNodeStable && prevStepNodeStable
                ? prevStepNodeStable.height - currenStepNodeStable.height
                : 0
            links.push(
              getLink(
                node,
                prevStepNodeSameType,
                prevStepNodeSameType.y1,
                node.y1 + offsetY,
                prevStepNodeSameType.y2,
                node.y2
              )
            )
          } else if (node.type === CellTypeEnum.Suitable) {
            links.push(
              getLink(
                node,
                prevStepNodeSameType,
                prevStepNodeSameType.y1,
                node.y1,
                prevStepNodeSameType.y2,
                node.y2
              )
            )
          }
        }
        if (
          node.type === CellTypeEnum.Decolonized &&
          prevStepNodeStable &&
          currenStepNodeStable
        ) {
          links.push(
            getLink(
              node,
              prevStepNodeStable,
              prevStepNodeStable.y1 + currenStepNodeStable.height,
              node.y1,
              prevStepNodeStable.y2,
              node.y1 +
                (prevStepNodeStable.height - currenStepNodeStable.height)
            )
          )
        }
        if (
          node.type === CellTypeEnum.Suitable &&
          !prevStepNodeSameType &&
          prevStepNodeStable
        ) {
          links.push(
            getLink(
              node,
              prevStepNodeStable,
              node.y1 + node.height / 2,
              node.y1,
              node.y1 + node.height / 2,
              node.y2
            )
          )
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

export default useTimeseriesLayout
