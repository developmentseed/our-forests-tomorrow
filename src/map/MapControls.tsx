import React from 'react'
import { MapControlsWrapper } from './MapControls.styled'
import MapLegend from './MapLegend'
import MapTimeseries from './MapTimeseries'
import MapSentence from './MapSentence'
import { Region, ValuesByYear } from '../types'

export type MapControlsProps = {
  timeseriesData: ValuesByYear | null
  mainColor: number[]
  currentRegionData?: Region
}

function MapControls({
  timeseriesData,
  mainColor,
  currentRegionData,
}: MapControlsProps) {
  return (
    <MapControlsWrapper>
      <MapSentence
        timeseriesData={timeseriesData}
        currentRegionData={currentRegionData}
      />
      <MapTimeseries timeseriesData={timeseriesData} mainColor={mainColor} />
      <MapLegend mainColor={mainColor} />
    </MapControlsWrapper>
  )
}

export default MapControls
