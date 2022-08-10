import React, {
  useCallback,
  useState,
  Fragment,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react'
import './Map.css'
import DeckGL from '@deck.gl/react/typed'
import { MapViewState, WebMercatorViewport } from '@deck.gl/core/typed'
import { CENTER, EUROPE_BBOX } from './constants'
import { RegionFeature, TimeStep } from './types'
import type { Feature } from 'geojson'
import Timeseries from './Timeseries'
import bbox from '@turf/bbox'
import cx from 'classnames'
import useMapLayers from './hooks/useMapLayers'

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: CENTER[0],
  latitude: CENTER[1],
  zoom: 3,
  // pitch: 30,
  bearing: 0,
}

export type MapProps = {
  timeStep: TimeStep
  species: string
  region: RegionFeature | null
  onRegionChange: Dispatch<SetStateAction<RegionFeature | null>>
  onRenderedFeaturesChange: Dispatch<SetStateAction<Feature[] | undefined>>
}

function Map({
  species,
  timeStep,
  region,
  onRegionChange,
  onRenderedFeaturesChange,
}: MapProps) {
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE)

  const { layers, countries, grid } = useMapLayers({
    timeStep,
    species,
    region,
    onRegionChange,
  })

  const timeoutId = useRef<undefined | ReturnType<typeof setTimeout>>(undefined)

  const onViewStateChange = useCallback(
    ({ viewState }: { viewState: MapViewState }) => {
      setViewState(viewState)
      if (timeoutId.current) clearTimeout(timeoutId.current)
      timeoutId.current = setTimeout(() => {
        try {
          onRenderedFeaturesChange(grid.getRenderedFeatures())
        } catch (e) {
          console.log(e)
        }
      }, 100)
    },
    [grid]
  )

  useEffect(() => {
    if (!countries.context) return
    const { viewport } = countries.context
    const wmViewport = viewport as WebMercatorViewport

    const baseBbox = region ? bbox(region.geometry) : EUROPE_BBOX
    const { longitude, latitude, zoom } = wmViewport.fitBounds(
      [
        [baseBbox[0], baseBbox[1]],
        [baseBbox[2], baseBbox[3]],
      ],
      { padding: 100 }
    )
    setViewState({
      ...viewState,
      longitude,
      latitude,
      zoom,
      transitionDuration: 1000,
    })
  }, [region])

  return (
    <Fragment>
      <div className={cx('map', { hasRegion: region !== null })}>
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          viewState={viewState}
          onViewStateChange={onViewStateChange as any}
          layers={layers}
        />
      </div>
    </Fragment>
  )
}

export default Map
