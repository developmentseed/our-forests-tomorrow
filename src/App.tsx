import React from 'react'
import './App.css'
import DeckGL from '@deck.gl/react/typed'
import { BitmapLayer } from '@deck.gl/layers/typed'
import { TileLayer, MVTLayer } from '@deck.gl/geo-layers/typed'
import { CENTER } from './constants'

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: CENTER[0],
  latitude: CENTER[1],
  zoom: 3,
  pitch: 30,
  bearing: 0,
}

function App() {
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

  const layer = new MVTLayer({
    data: 'http://localhost:9090/Fraxinus_excelsior/{z}/{x}/{y}.pbf',
    minZoom: 0,
    maxZoom: 7,
    getPointRadius: 1000,
    getFillColor: [255, 0, 0],
    pointType: 'circle',
  })

  const layers = [basemap, layer]

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
    />
  )
}

export default App
