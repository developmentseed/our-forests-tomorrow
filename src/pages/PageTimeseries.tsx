import SimpleTimeseries from '../components/SimpleTimeseries'
import { ValuesByYear } from '../types'

type StatsDropdownProps = {
  data: [string, ValuesByYear][]
  onItemClick?: (d: ValuesByYear) => void
}

function PageTimeseries({ data, onItemClick }: StatsDropdownProps) {
  return (
    <div>
      {data.slice(0, 10).map((d, i) => (
        <li
          key={i}
          onClick={() => {
            if (onItemClick) onItemClick(d[1])
          }}
        >
          {d[1].label}
          <SimpleTimeseries data={d[1]} />
        </li>
      ))}
    </div>
  )
}

export default PageTimeseries
