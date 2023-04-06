import React, {
  useCallback,
  useState,
  Fragment,
  Dispatch,
  SetStateAction,
  ReactNode,
} from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Map, ViewState } from 'react-map-gl'
import { useAtomValue } from 'jotai'
import { MAP_DEFAULT_VIEWPORT } from '../constants'
import { Region } from '../types'
import type { Feature, FeatureCollection } from 'geojson'
import { MapWrapper, MapZoom } from './Map.styled'
import { currentSpeciesAtom, introCompletedAtom, timeStepAtom } from '../atoms'
import useMapStyle from '../hooks/useMapStyle'

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

  const onZoomIn = useCallback(() => {
    setViewState({
      ...viewState,
      zoom: viewState.zoom + 1,
    })
  }, [setViewState, viewState])

  const onZoomOut = useCallback(() => {
    setViewState({
      ...viewState,
      zoom: viewState.zoom - 1,
    })
  }, [setViewState, viewState])


  const onIdle = useCallback(() => {

  }, [])


  const style = useMapStyle()

  return (
    <Fragment>
      <MapWrapper fixed={!introCompleted}>
        <Map
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          {...viewState}
          onMove={onViewStateChange}
          onIdle={onIdle}
          mapStyle={style as any}
        />
        <MapZoom visible={introCompleted}>
          <button onClick={onZoomIn}>+</button>
          <button onClick={onZoomOut}>-</button>
        </MapZoom>
        {children}
      </MapWrapper>
    </Fragment>
  )
}

export default MapboxGLMap
