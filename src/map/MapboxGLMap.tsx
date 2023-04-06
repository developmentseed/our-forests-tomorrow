import React, {
  useCallback,
  useState,
  Fragment,
  Dispatch,
  SetStateAction,
  ReactNode,
} from 'react'
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAP_DEFAULT_VIEWPORT } from '../constants'
import { Region } from '../types'
import type { Feature, FeatureCollection } from 'geojson'
import { MapWrapper } from './Map.styled'
import { currentSpeciesAtom, introCompletedAtom, timeStepAtom } from '../atoms'
import { useAtomValue } from 'jotai'
import style from './style.json'
import { Map, ViewState } from 'react-map-gl'

export type MapboxGLMapProps = {
  mainColor: number[]
  onRenderedFeaturesChange: Dispatch<SetStateAction<Feature[] | undefined>>
  children: ReactNode
  currentRegionData?: Region
  regionsGeoJson: FeatureCollection
  countriesGeoJson: FeatureCollection
}

function MapboxGLMap({
  mainColor,
  onRenderedFeaturesChange,
  children,
  currentRegionData,
  regionsGeoJson,
  countriesGeoJson,
}: MapboxGLMapProps) {
  const currentSpecies = useAtomValue(currentSpeciesAtom)
  const timeStep = useAtomValue(timeStepAtom)
  const introCompleted = useAtomValue(introCompletedAtom)

  const [viewState, setViewState] = useState<ViewState>(MAP_DEFAULT_VIEWPORT)
  const onViewStateChange = useCallback(
    ({ viewState: vs }: { viewState: ViewState }) => {
      setViewState(vs)
    },
    []
  )
  return (
    <Fragment>
      <MapWrapper
        fixed={!introCompleted}
      >
        <Map
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          {...viewState}
          onMove={onViewStateChange}
          mapStyle="mapbox://styles/mapbox/streets-v9"
        />
        {children}
      </MapWrapper>
    </Fragment>
  )
}

export default MapboxGLMap
