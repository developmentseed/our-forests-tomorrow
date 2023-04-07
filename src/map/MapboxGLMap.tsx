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

export type MapboxGLMapProps = {
  mainColor: number[]
  children: ReactNode
  regionsGeoJson: FeatureCollection
  countriesGeoJson: FeatureCollection
}

function MapboxGLMap({
  mainColor,
  children,
  regionsGeoJson,
  countriesGeoJson,
}: MapboxGLMapProps) {
  const introCompleted = useAtomValue(introCompletedAtom)

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

  const mapRef = useRef<MapRef>(null)

  const style = useMapStyle()

  return (
    <Fragment>
      <MapWrapper fixed={!introCompleted}>
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
            customAttribution="Map design by me"
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
