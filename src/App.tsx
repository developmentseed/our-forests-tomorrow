import React, {
  useCallback,
  useState,
  Fragment,
  ChangeEvent,
  useMemo,
  useRef,
} from 'react'
import './App.css'
import DeckGL from '@deck.gl/react/typed'
import { MapViewState } from '@deck.gl/core/typed'
import { BitmapLayer } from '@deck.gl/layers/typed'
import { TileLayer, MVTLayer } from '@deck.gl/geo-layers/typed'
import {
  CENTER,
  COLOR_BY_CELL_TYPE,
  FUT_BY_TIME_STEP,
  MAX_ZOOM,
} from './constants'
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

const isLocal = window.location.hostname === 'localhost'
const baseTilesURL = isLocal
  ? '//localhost:9090/'
  : '//storage.googleapis.com/eu-trees4f-tiles/pbf'

function App() {
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE)

  const [timeStep, setTimeStep] = useState<TimeStep>('2005')
  const onTimestepChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTimeStep(e.target.value.toString() as TimeStep)
  }, [])

  const [species, setSpecies] = useState<string>('Fraxinus_excelsior')
  const onSpeciesChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setSpecies(e.target.value)
  }, [])
  const gridLayer = useMemo(
    () =>
      new MVTLayer({
        data: `${baseTilesURL}/${species}/{z}/{x}/{y}.pbf`,
        minZoom: 0,
        maxZoom: 8,
        pickable: true,
        pointType: 'circle',
        getPointRadius: () => {
          // TODO Need more ad-hoc rule depending on grid size
          return ((MAX_ZOOM - viewState.zoom) / MAX_ZOOM) * 20000
        },
        getFillColor: (d: Cell) => {
          return COLOR_BY_CELL_TYPE[getCellTypeAtTimeStep(d, timeStep)]
        },
        updateTriggers: {
          // This tells deck.gl to recalculate fill color when `timeStep` changes
          getFillColor: timeStep,
        },
        onViewportLoad: (tiles) => {
          // This gets Raw MVT data...
          // console.log(tiles)
          // console.log(tiles[0].data)
          //   try {
          //     console.log(gridLayer.getRenderedFeatures(100))
          //   } catch (e) {
          //     console.log(e)
          //   }
        },
      }),
    [viewState.zoom, timeStep, species]
  )

  const layers = [basemap, gridLayer]

  const timeoutId = useRef<undefined | ReturnType<typeof setTimeout>>(undefined)
  const [timeseries, setTimeseries] = useState<undefined | Feature[]>(undefined)
  const onViewStateChange = useCallback(
    ({ viewState }: { viewState: MapViewState }) => {
      // // Manipulate view state
      // viewState.target[0] = Math.min(viewState.target[0], 10)
      // // Save the view state and trigger rerender
      setViewState(viewState)
      if (timeoutId.current) clearTimeout(timeoutId.current)
      timeoutId.current = setTimeout(() => {
        console.log('ping')
        try {
          setTimeseries(gridLayer.getRenderedFeatures())
        } catch (e) {
          console.log(e)
        }
      }, 100)
    },
    [gridLayer]
  )

  const deckRef = useRef(null)

  return (
    <Fragment>
      <DeckGL
        ref={deckRef}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        viewState={viewState}
        onViewStateChange={onViewStateChange as any}
        layers={layers}
      />
      <div className="ui">
        <div>
          <label htmlFor="species">Species:</label>

          <select name="species" id="species" onChange={onSpeciesChange}>
            <option value="Fraxinus_excelsior">Fraxinus Excelsior</option>
            <option value="Quercus_ilex">Quercus Ilex</option>
          </select>
        </div>
        <input
          type="range"
          list="tickmarks"
          min="2005"
          max="2095"
          step="30"
          onChange={onTimestepChange}
          value={timeStep}
        ></input>
        <datalist id="tickmarks">
          <option value="2005" label="2005"></option>
          <option value="2035" label="2035"></option>
          <option value="2065" label="2065"></option>
          <option value="2095" label="2095"></option>
        </datalist>
        {timeStep}
      </div>
      <div className="timeseries">
        <Timeseries features={timeseries} />
      </div>
    </Fragment>
  )
}

export default App
