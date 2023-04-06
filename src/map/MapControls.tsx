import React from 'react'
import { MapControlsWrapper } from './MapControls.styled'
import MapLegend from './MapLegend'
import MapTimeseries from './MapTimeseries'
import MapSentence from './MapSentence'
import { ValuesByYear } from '../types'

export type MapControlsProps = {
  timeseriesData: ValuesByYear | null
  mainColor: number[]
}

function MapControls({ timeseriesData, mainColor }: MapControlsProps) {
  return (
    <MapControlsWrapper>
      <MapSentence timeseriesData={timeseriesData} />
      <MapTimeseries timeseriesData={timeseriesData} mainColor={mainColor} />
      <MapLegend mainColor={mainColor} />
    </MapControlsWrapper>
  )
}

export default MapControls
