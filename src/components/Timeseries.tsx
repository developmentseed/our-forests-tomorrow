import { Fragment } from 'react'
import { TimeseriesLayoutData } from '../hooks/useTimeseriesLayout'

export type TimeseriesProps = {
  layoutData: TimeseriesLayoutData
  width: number
  height: number
}

function Timeseries({ layoutData, width, height }: TimeseriesProps) {
  const { nodes, links } = layoutData

  return (
    <Fragment>
      <div style={{ position: 'relative' }}>
        <svg
          width={width}
          height={height}
          // style={{ border: '1px solid rgba(0,0,0,.1)' }}
        >
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
            <path
              key={`link_${li}`}
              d={l.d}
              fill={l.fill}
              // style={{ opacity: 0.5 }}
              // stroke="red"
            />
          ))}
        </svg>
      </div>
    </Fragment>
  )
}

export default Timeseries
