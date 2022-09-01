import React, {
  useCallback,
  useState,
  Fragment,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react'
import DeckGL, { DeckGLRef } from '@deck.gl/react/typed'
import bbox from '@turf/bbox'
import { MapViewState, WebMercatorViewport } from '@deck.gl/core/typed'
import { CENTER, EUROPE_BBOX } from '../constants'
import { CellProps, Region, RegionFeature, TimeStep } from '../types'
import type { Feature } from 'geojson'
import useMapLayers from '../hooks/useMapLayers'
import { PickingInfo } from '@deck.gl/core/typed'
import { MapWrapper, MapZoom } from './Map.styled'

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
  currentSpecies: string
  mainColor: number[]
  region: RegionFeature | null
  onRegionChange: Dispatch<SetStateAction<RegionFeature | null>>
  onRenderedFeaturesChange: Dispatch<SetStateAction<Feature[] | undefined>>
}

function Map({
  timeStep,
  currentSpecies,
  mainColor,
  region,
  onRegionChange,
  onRenderedFeaturesChange,
}: MapProps) {
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE)

  const { layers, countries, grid } = useMapLayers({
    timeStep,
    currentSpecies,
    mainColor,
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

  const onZoomIn = useCallback(() => {
    setViewState({
      ...viewState,
      zoom: viewState.zoom + 1,
      transitionDuration: 100,
    })
  }, [setViewState, viewState])

  const onZoomOut = useCallback(() => {
    setViewState({
      ...viewState,
      zoom: viewState.zoom - 1,
      transitionDuration: 100,
    })
  }, [setViewState, viewState])

  const deckRef = useRef<DeckGLRef>(null)
  const onMouseMove = useCallback(
    (event: any) => {
      if (!deckRef.current) return
      const pickInfo = deckRef.current.pickObjects({
        x: event.clientX,
        y: event.clientY,
      })
      const gridCell = pickInfo.find((o) => o?.layer?.id === 'grid')
      const region = pickInfo.find((o) => o?.layer?.id === 'regions')
      const country = pickInfo.find((o) => o?.layer?.id === 'countries')

      const tooltips: string[] = []
      if (gridCell) {
        const gridCellProps = gridCell.object.properties as CellProps
        let msg
        if (timeStep === '2005') {
          msg =
            gridCellProps.nat_2005 === 0
              ? `${currentSpecies} is not naturally present here`
              : `${currentSpecies} is naturally present here`
        } else {
          const prob = gridCellProps[`prob_${timeStep}`]
          const status = gridCellProps[`status_${timeStep}`]
          // TODO copy
          msg = `Probability for ${currentSpecies} here in ${timeStep} is ${prob}/1000 (status ${status})`
        }
        tooltips.push(msg)
      }
      if (region || country) {
        const regionProps = region?.object?.properties as Region
        const countryProps = country?.object?.properties
        const label = region ? regionProps.NAME_1 : countryProps.COUNTRY
        tooltips.push(`Click to analyze ${label}`)
      }
      // console.log(tooltips)
    },
    [deckRef, timeStep, currentSpecies]
  )

  return (
    <Fragment>
      <MapWrapper onMouseMove={onMouseMove}>
        <DeckGL
          ref={deckRef}
          initialViewState={INITIAL_VIEW_STATE}
          controller={{ scrollZoom: false }}
          viewState={viewState}
          onViewStateChange={onViewStateChange as any}
          layers={layers}
        />
        <MapZoom>
          <button onClick={onZoomIn}>+</button>
          <button onClick={onZoomOut}>-</button>
        </MapZoom>
      </MapWrapper>
    </Fragment>
  )
}

export default Map
