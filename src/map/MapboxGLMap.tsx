import React, {
  useCallback,
  useState,
  Fragment,
  ReactNode,
  useRef,
} from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Map, ViewState, MapRef, AttributionControl } from 'react-map-gl'
import { useAtomValue } from 'jotai'
import { MAP_DEFAULT_VIEWPORT } from '../constants'
import type { FeatureCollection } from 'geojson'
import { MapWrapper, MapZoom } from './Map.styled'
import { introCompletedAtom } from '../atoms'
import useMapStyle from '../hooks/useMapStyle'
import { useIntroMapTransitions } from '../hooks/useIntroMapTransitions'

// https://github.com/visgl/react-map-gl/issues/1266#issuecomment-1270562441
// @ts-ignore
import mapboxgl from "mapbox-gl";
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass =
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default; /* eslint import/no-webpack-loader-syntax: off */

export type MapboxGLMapProps = {
  children: ReactNode
  regionsGeoJson: FeatureCollection
  countriesGeoJson: FeatureCollection
}

function MapboxGLMap({
  children,
  regionsGeoJson,
  countriesGeoJson,
}: MapboxGLMapProps) {
  const mapRef = useRef<MapRef | null>(null)
  
  const [viewState, setViewState] = useState<ViewState>(MAP_DEFAULT_VIEWPORT)
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
  useIntroMapTransitions(viewState, setViewState, mapRef.current)

  const style = useMapStyle()

  return (
    <Fragment>
      <MapWrapper>
        <Map
          ref={mapRef}
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          {...viewState}
          onMove={onViewStateChange}
          mapStyle={style as any}
          projection="globe"
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

export default MapboxGLMap
