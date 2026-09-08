import React, {
  useCallback,
  useState,
  Fragment,
  ReactNode,
  useRef,
} from 'react'

import 'maplibre-gl/dist/maplibre-gl.css'

import Map, {
  ViewState,
  MapRef,
  AttributionControl,
} from 'react-map-gl/maplibre'

import { useAtomValue } from 'jotai'

import { MAP_DEFAULT_VIEWPORT } from '../constants'

import type { FeatureCollection } from 'geojson'

import { MapWrapper, MapZoom } from './Map.styled'

import { introCompletedAtom } from '../atoms'

import useMapStyle from '../hooks/useMapStyle'
import { useIntroMapTransitions } from '../hooks/useIntroMapTransitions'

export type MaplibreGLMapProps = {
  children: ReactNode
  regionsGeoJson: FeatureCollection
  countriesGeoJson: FeatureCollection
}

function MaplibreGLMap({
  children,
  regionsGeoJson,
  countriesGeoJson,
}: MaplibreGLMapProps) {
  const mapRef = useRef<MapRef | null>(null)

  const [viewState, setViewState] =
    useState<ViewState>(MAP_DEFAULT_VIEWPORT)

  const onViewStateChange = useCallback(
    ({ viewState: vs }: { viewState: ViewState }) => {
      setViewState(vs)
    },
    []
  )

  const onZoomIn = useCallback(() => {
    mapRef.current?.zoomIn()
  }, [])

  const onZoomOut = useCallback(() => {
    mapRef.current?.zoomOut()
  }, [])

  const introCompleted = useAtomValue(introCompletedAtom)

  useIntroMapTransitions(
    viewState,
    setViewState,
    mapRef.current
  )

  const style = useMapStyle()

  return (
    <Fragment>
      <MapWrapper fullMobile={introCompleted}>
        <Map
          ref={mapRef}
          {...viewState}
          onMove={onViewStateChange}
          mapStyle={style as any}
          scrollZoom={false}
          attributionControl={false}
        >
          <AttributionControl
            customAttribution=""
            compact={true}
          />
        </Map>

        <MapZoom visible={introCompleted}>
          <button onClick={onZoomIn}>+</button>
          <button onClick={onZoomOut}>-</button>
        </MapZoom>

        {children}
      </MapWrapper>
    </Fragment>
  )
}

export default MaplibreGLMap
