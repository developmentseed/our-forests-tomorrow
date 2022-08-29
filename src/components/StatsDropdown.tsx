import { useMemo } from 'react'
import { ValuesByYear } from '../types'
import InlineDropdown from './InlineDropdown'
import Timeseries from './Timeseries'

type StatsDropdownProps = {
  data: [string, ValuesByYear][]
  color: number[]
  labelKey?: string
}

function StatsDropdown({
  data,
  color,
  labelKey = 'region',
}: StatsDropdownProps) {
  const items = useMemo(() => {
    return data.map((entry) => ({
      data: entry[1],
      label:
        labelKey === 'region'
          ? entry[1].region?.label
          : entry[1]?.speciesDetail?.name,
    }))
  }, [data, labelKey])
  return (
    <InlineDropdown items={items}>
      <ul>
        {items.slice(0, 10).map((d) => (
          <li key={d.label}>
            {d.label}
            <Timeseries
              data={d.data}
              width={70}
              height={25}
              mainColor={color}
            />
          </li>
        ))}
      </ul>
    </InlineDropdown>
  )
}

export default StatsDropdown
