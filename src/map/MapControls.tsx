import React from 'react'
import { MapControlsWrapper } from './MapControls.styled'
import MapLegend from './MapLegend'
import MapTimeseries from './MapTimeseries'
import MapSentence from './MapSentence'

function MapControls() {
  return (
    <MapControlsWrapper>
      <MapSentence />
      {/* <MapTimeseries />
      <MapLegend /> */}
    </MapControlsWrapper>
  )
}

export default MapControls
