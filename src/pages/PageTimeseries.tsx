import SimpleTimeseries from '../components/SimpleTimeseries'
import { ValuesByYear } from '../types'
import { PageTimeseriesItem } from './PageTimeseries.styled'

type StatsDropdownProps = {
  data: [string, ValuesByYear][]
  onItemClick?: (d: ValuesByYear) => void
}

function PageTimeseries({ data, onItemClick }: StatsDropdownProps) {
  const items = data.slice(0, 999)
  return (
    <ul>
      {items.map((d, i) => (
        <PageTimeseriesItem
          key={i}
          onClick={() => {
            if (onItemClick) onItemClick(d[1])
          }}
        >
          <label>{d[1].label}</label>
          <SimpleTimeseries data={d[1]} showYears={i === items.length - 1} />
        </PageTimeseriesItem>
      ))}
    </ul>
  )
}

export default PageTimeseries
