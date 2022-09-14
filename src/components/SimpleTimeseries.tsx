import useTimeseriesLayout from '../hooks/useTimeseriesLayout'
import { ValuesByYear } from '../types'
import Timeseries from './Timeseries'

type SimpleTimeseriesProps = {
  data: ValuesByYear
  labelKey?: string
}

const W = 130
const H = 34

function SimpleTimeseries({ data }: SimpleTimeseriesProps) {
  const layoutData = useTimeseriesLayout(data, {
    width: W,
    height: H,
    nodeWidth: 24,
    nodeMaxHeight: 8,
  })

  return <Timeseries layoutData={layoutData} width={W} height={H} />
}

export default SimpleTimeseries
