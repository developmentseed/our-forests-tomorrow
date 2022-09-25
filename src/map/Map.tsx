import React, {
  useCallback,
  useState,
  Fragment,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
  ReactNode,
  useLayoutEffect,
} from 'react'
import DeckGL, { DeckGLRef } from '@deck.gl/react/typed'
import { MapViewState, WebMercatorViewport } from '@deck.gl/core/typed'
import { MAP_DEFAULT_VIEWPORT } from '../constants'
import { CellProps, Region } from '../types'
import type { Feature } from 'geojson'
import useMapLayers from '../hooks/useMapLayers'
import { PickingInfo } from '@deck.gl/core/typed'
import { MapWrapper, MapZoom } from './Map.styled'
import { currentSpeciesAtom, introCompletedAtom, timeStepAtom } from '../atoms'
import { useAtomValue } from 'jotai'
import { useIntroMapTransitions } from '../hooks/useIntroMapTransitions'

export type MapProps = {
  mainColor: number[]
  onRenderedFeaturesChange: Dispatch<SetStateAction<Feature[] | undefined>>
  children: ReactNode
  currentRegionData?: Region
}

function Map({
  mainColor,
  onRenderedFeaturesChange,
  children,
  currentRegionData,
}: MapProps) {
  const currentSpecies = useAtomValue(currentSpeciesAtom)
  const timeStep = useAtomValue(timeStepAtom)
  const introCompleted = useAtomValue(introCompletedAtom)

  const [viewState, setViewState] = useState<MapViewState>(MAP_DEFAULT_VIEWPORT)
  const mapWrapperRef = useRef(null)

  const timeoutId = useRef<undefined | ReturnType<typeof setTimeout>>(undefined)
  const onGridLoaded = useCallback(
    (grid_: any) => {
      if (timeoutId.current) clearTimeout(timeoutId.current)
      timeoutId.current = setTimeout(() => {
        // console.log(grid_, grid_.getRenderedFeatures())
        onRenderedFeaturesChange(grid_.getRenderedFeatures())
      }, 1)
    },
    [onRenderedFeaturesChange]
  )

  const { layers, hexGrid } = useMapLayers({
    mainColor,
    onGridLoaded,
  })

  useIntroMapTransitions(viewState, setViewState)

  const onViewStateChange = useCallback(
    ({ viewState }: { viewState: MapViewState }) => {
      setViewState(viewState)
      if (timeoutId.current) clearTimeout(timeoutId.current)
      timeoutId.current = setTimeout(() => {
        try {
          onRenderedFeaturesChange(hexGrid.getRenderedFeatures())
        } catch (e) {
          console.log(e)
        }
      }, 300)
    },
    [hexGrid, onRenderedFeaturesChange]
  )

  const [mapSize, setMapSize] = useState<null | {
    width: number
    height: number
  }>(null)
  useLayoutEffect(() => {
    setMapSize({
      width: (mapWrapperRef.current as any).offsetWidth,
      height: (mapWrapperRef.current as any).offsetHeight,
    })
  }, [])

  useEffect(() => {
    const bbox = currentRegionData?.bbox
    if (!bbox || !mapSize) return

    const wmViewport = new WebMercatorViewport({
      ...viewState,
      width: mapSize.width,
      height: mapSize.height,
    })

    const { longitude, latitude, zoom } = wmViewport.fitBounds(
      [
        [bbox[0], bbox[1]],
        [bbox[2], bbox[3]],
      ],
      { padding: 20 }
    )

    // TODO won't work on mount as onViewStateChange happens after
    setViewState({
      ...viewState,
      longitude,
      latitude,
      zoom,
      transitionDuration: 1000,
    })
  }, [currentRegionData, mapWrapperRef, mapSize?.width, mapSize?.height])

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
      <MapWrapper
        onMouseMove={onMouseMove}
        fixed={!introCompleted}
        ref={mapWrapperRef}
      >
        <DeckGL
          ref={deckRef}
          // initialViewState={INITIAL_VIEW_STATE}
          controller={{ scrollZoom: false }}
          viewState={viewState}
          onViewStateChange={onViewStateChange as any}
          layers={layers}
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

export default Map
