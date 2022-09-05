import useTimeseriesLayout from '../hooks/useTimeseriesLayout'
import { ValuesByYear } from '../types'
import Timeseries from './Timeseries'

type SimpleTimeseriesProps = {
  data: ValuesByYear
  color: number[]
  labelKey?: string
}

const W = 160
const H = 40

function SimpleTimeseries({ data, color }: SimpleTimeseriesProps) {
  const layoutData = useTimeseriesLayout(data, {
    width: W,
    height: H,
    mainColor: color,
    nodeWidth: 35,
    nodeMaxHeight: 10,
  })

  return (
    <Timeseries
      layoutData={layoutData}
      mainColor={color}
      width={W}
      height={H}
    />
  )
}

export default SimpleTimeseries
