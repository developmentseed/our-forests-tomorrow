import { ValuesByYear } from '../types'
import InlineDropdown from './InlineDropdown'
import Timeseries from './Timeseries'

type StatsDropdownProps = {
  data: [string, ValuesByYear][]
  color: number[]
}

function StatsDropdown({ data, color }: StatsDropdownProps) {
  return (
    <InlineDropdown data={data}>
      <ul>
        {data.slice(0, 10).map((d) => (
          <li key={d[0]}>
            {d[1].region?.label}
            <Timeseries data={d[1]} width={70} height={25} mainColor={color} />
          </li>
        ))}
      </ul>
    </InlineDropdown>
  )
}

export default StatsDropdown
