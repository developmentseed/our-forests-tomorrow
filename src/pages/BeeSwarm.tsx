import { extent } from 'd3-array'
import { scaleLinear, scaleSequential, scaleSqrt } from 'd3-scale'
import { forceSimulation, forceY,forceX, forceCollide } from 'd3-force'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { ValuesBySpeciesID } from '../types'

type BeeSwarmProps = {
  data: ValuesBySpeciesID
}

const MAX_RADIUS = 50
const HEIGHT = 1500
function BeeSwarm({ data }: BeeSwarmProps) {
  const filteredData = useMemo(() => {
    const sum = (acc: number, current?: number) =>
      current ? (acc as number) + current : acc
    const species = Object.values(data).filter((d) => d)
    const speciesWithValues = species.map((spec) => {
      const sum2035 = spec[2035].reduce(sum, 0)
      const avg2035 = (-spec[2035][0] + spec[2035][2]) / sum2035
      const sum2065 = spec[2065].reduce(sum, 0)
      const avg2065 = (-spec[2065][0] + spec[2065][2]) / sum2065
      const sum2095 = spec[2095].reduce(sum, 0)
      const avg2095 = (-spec[2095][0] + spec[2095][2]) / sum2095
      return {
        ...spec,
        '2035': [sum2035, avg2035],
        '2065': [sum2065, avg2065],
        '2095': [sum2095, avg2095],
      }
    })
    return speciesWithValues
  }, [data])

  const [year, setYear] = useState('2035');
  const onYearChange = useCallback((e: any) => {
    setYear(['2035', '2065', '2095'][parseInt( e.target.value)])
  }, [])

  const {scaleY, scaleR, scaleColor } = useMemo(() => {
    const scaleY = scaleLinear()
      .domain([-1, 1])
      .range([MAX_RADIUS, HEIGHT - MAX_RADIUS])
    const extentR = extent(filteredData, (d) => (d as any)[year][0]) as [number, number]
    const scaleR = scaleSqrt().domain(extentR).range([1, MAX_RADIUS])
    const scaleColor = scaleSequential().domain([-1, 1]).range(['#f00', '#0f0'] as any)
    return {
      scaleY, scaleR, scaleColor
    }
  }, [filteredData, year])

  const sim = useMemo(() => {
    // console.log(filteredData)
    const simulation = forceSimulation(filteredData as any)
      .force('y', forceY(d => scaleY((d as any)[year][1])))
      .force('x', forceX(d => 0))
      .force("collide", forceCollide(d => scaleR((d as any)[year][0]) + 1).strength(.1));
    simulation.stop()
    return simulation.tick(1000).nodes()
  }, [filteredData, year, scaleY, scaleR])

  return (
    <Fragment>
      <div>{filteredData.length} species</div>
      <div><input type="range" min="0" max="2" onChange={onYearChange}/></div>
      <svg width={800} height={2000}>
        {sim.map((spec: any, i) => (
          <g key={i} transform={`translate(${spec.x + 400}, ${spec.y})`} style={{ transition: 'all 500ms' }}>
            <circle fill={scaleColor(spec[year][1]) as any} stroke="black" r={scaleR(spec[year][0])} />
            <text textAnchor='middle'>{spec.species}</text>
          </g>
        ))}
      </svg>
    </Fragment>
  )
}

export default BeeSwarm
