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
    nodeWidth: 42,
    nodeMaxHeight: 12,
    nodeMinHeightToBeVisible: 0,
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
            height: showYears ? '90px' : '100%',
          }}
        >
          {showYears ? <span>{year}</span> : ''}
        </TimestepColumn>
      ))}
      <div style={{ padding: '10px 0' }}>
        <Timeseries layoutData={layoutData} width={W} height={H} />
      </div>
    </div>
  )
}

export default SimpleTimeseries
