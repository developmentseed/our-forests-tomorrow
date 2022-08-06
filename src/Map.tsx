import React, { useCallback, useState, Fragment, useMemo, useRef } from 'react'
import './Map.css'
import DeckGL from '@deck.gl/react/typed'
import { MapViewState } from '@deck.gl/core/typed'
import { BitmapLayer } from '@deck.gl/layers/typed'
import { TileLayer, MVTLayer } from '@deck.gl/geo-layers/typed'
import { CENTER, COLOR_BY_CELL_TYPE, SPECIES_COLORS } from './constants'
import { Cell, TimeStep } from './types'
import type { Feature } from 'geojson'
import Timeseries from './Timeseries'
import { getCellTypeAtTimeStep } from './utils'

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: CENTER[0],
  latitude: CENTER[1],
  zoom: 3,
  // pitch: 30,
  bearing: 0,
}

const isLocal = window.location.hostname === 'localhost'
const baseTilesURL = isLocal
  ? '//localhost:9090/'
  : '//storage.googleapis.com/eu-trees4f-tiles/pbf'

const basemap = new TileLayer({
  data: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
  minZoom: 0,
  maxZoom: 19,
  tileSize: 256,

  renderSubLayers: (props) => {
    const {
      bbox: { west, south, east, north },
    } = props.tile as any

    return new BitmapLayer(props, {
      data: null,
      image: props.data,
      bounds: [west, south, east, north],
    })
  },
})

export type MapProps = {
  timeStep: TimeStep
  species: string
}

function Map({ species, timeStep }: MapProps) {
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE)
  const [tilesZoom, setTilesZoom] = useState(viewState.zoom)

  const gridLayer = useMemo(
    () =>
      new MVTLayer({
        data: `${baseTilesURL}/${species}/{z}/{x}/{y}.pbf`,
        minZoom: 0,
        maxZoom: 8,
        pickable: true,
        pointType: 'circle',
        getPointRadius: () => {
          if (tilesZoom <= 2) {
            return 20000
          } else if (tilesZoom >= 3 && tilesZoom <= 4) {
            return 10000
          } else if (tilesZoom >= 5 && tilesZoom <= 6) {
            return 5000
          } else if (tilesZoom >= 6) {
            return 2500
          }
        },
        getFillColor: (d: Cell) => {
          const type = getCellTypeAtTimeStep(d, timeStep)
          if (type === 'stable') return SPECIES_COLORS[species]
          return COLOR_BY_CELL_TYPE[getCellTypeAtTimeStep(d, timeStep)]
        },
        updateTriggers: {
          // This tells deck.gl to recalculate fill color when `timeStep` changes
          getFillColor: timeStep,
          getPointRadius: tilesZoom,
        },
        onViewportLoad: (tiles) => {
          if (tiles && tiles[0] && tiles[0].zoom !== tilesZoom) {
            setTilesZoom(tiles[0].zoom)
          }
        },
      }),
    [timeStep, species, tilesZoom]
  )

  const layers = [basemap, gridLayer]

  const timeoutId = useRef<undefined | ReturnType<typeof setTimeout>>(undefined)
  const [renderedFeatures, setRenderedFeatures] = useState<
    undefined | Feature[]
  >(undefined)
  const onViewStateChange = useCallback(
    ({ viewState }: { viewState: MapViewState }) => {
      setViewState(viewState)
      if (timeoutId.current) clearTimeout(timeoutId.current)
      timeoutId.current = setTimeout(() => {
        try {
          setRenderedFeatures(gridLayer.getRenderedFeatures())
        } catch (e) {
          console.log(e)
        }
      }, 100)
    },
    [gridLayer]
  )

  return (
    <Fragment>
      <div className="map">
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          viewState={viewState}
          onViewStateChange={onViewStateChange as any}
          layers={layers}
          // style={{ position: 'fixed', border: '1px solid red' }}
        />
      </div>

      <div className="timeseries">
        <Timeseries features={renderedFeatures} />
      </div>
    </Fragment>
  )
}

export default Map
