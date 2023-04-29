import React from 'react'
import { MapControlsWrapper } from './MapControls.styled'
import MapLegend from './MapLegend'
import MapTimeseries from './MapTimeseries'
import MapSentence from './MapSentence'

export type MapControlsProps = {
  mainColor: number[]
}

function MapControls({ mainColor }: MapControlsProps) {
  return (
    <MapControlsWrapper>
      <MapSentence />
      <MapTimeseries />
      <MapLegend />
    </MapControlsWrapper>
  )
}

export default MapControls
