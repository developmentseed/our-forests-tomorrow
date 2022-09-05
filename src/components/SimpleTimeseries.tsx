import useTimeseriesLayout from '../hooks/useTimeseriesLayout'
import { ValuesByYear } from '../types'
import Timeseries from './Timeseries'

type SimpleTimeseriesProps = {
  data: ValuesByYear
  color: number[]
  labelKey?: string
}

function SimpleTimeseries({ data, color }: SimpleTimeseriesProps) {
  const layoutData = useTimeseriesLayout(data, {
    width: 220,
    height: 80,
    mainColor: color,
  })

  return (
    <Timeseries
      layoutData={layoutData}
      mainColor={color}
      width={220}
      height={80}
    />
  )
}

export default SimpleTimeseries
