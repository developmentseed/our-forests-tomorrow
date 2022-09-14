import { TIME_STEPS } from '../constants'
import useTimeseriesLayout from '../hooks/useTimeseriesLayout'
import { ValuesByYear } from '../types'
import Timeseries from './Timeseries'
import { TimestepColumn } from './TimestepColumn.styled'

type SimpleTimeseriesProps = {
  data: ValuesByYear
  showYears?: boolean
}

const W = 230
const H = 40

function SimpleTimeseries({ data, showYears }: SimpleTimeseriesProps) {
  const layoutData = useTimeseriesLayout(data, {
    width: W,
    height: H,
    nodeWidth: 50,
    nodeMaxHeight: 8,
  })

  const { xs, nodeWidth } = layoutData

  return (
    <div style={{ position: 'relative' }}>
      {TIME_STEPS.map((year, yi) => (
        <TimestepColumn
          key={yi}
          style={{
            left: xs?.[yi],
            width: `${nodeWidth}px`,
            height: showYears ? '90px' : '50px',
          }}
        >
          {showYears ? <span>{year}</span> : ''}
        </TimestepColumn>
      ))}
      <Timeseries layoutData={layoutData} width={W} height={H} />
    </div>
  )
}

export default SimpleTimeseries
