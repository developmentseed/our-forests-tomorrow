import { Feature } from 'geojson'
import React from 'react'
import { MapControlsWrapper } from './MapControls.styled'
import MapTimeseries from './MapTimeseries'

export type MapControlsProps = {
  features?: Feature[]
  mainColor: number[]
}

function MapControls({ features, mainColor }: MapControlsProps) {
  return (
    <MapControlsWrapper>
      <MapTimeseries features={features} mainColor={mainColor} />
    </MapControlsWrapper>
  )
}

export default MapControls
