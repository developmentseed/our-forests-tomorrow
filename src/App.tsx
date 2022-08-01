import React, {
  useCallback,
  useState,
  Fragment,
  ChangeEvent,
  useMemo,
} from 'react'
import './App.css'
import DeckGL from '@deck.gl/react/typed'
import { MapViewState } from '@deck.gl/core/typed'
import { BitmapLayer } from '@deck.gl/layers/typed'
import { TileLayer, MVTLayer } from '@deck.gl/geo-layers/typed'
import { CENTER, FUT_BY_TIME_STEP, MAX_ZOOM } from './constants'
import { Cell, TimeStep } from './types'

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

function App() {
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE)

  const onViewStateChange = useCallback(
    ({ viewState }: { viewState: MapViewState }) => {
      // // Manipulate view state
      // viewState.target[0] = Math.min(viewState.target[0], 10)
      // // Save the view state and trigger rerender
      setViewState(viewState)
    },
    []
  )
  const [timeStep, setTimeStep] = useState<TimeStep>('2005')
  const onTimestepChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTimeStep(e.target.value.toString() as TimeStep)
  }, [])

  const [species, setSpecies] = useState<string>('Fraxinus_excelsior')
  const onSpeciesChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setSpecies(e.target.value)
  }, [])

  const layers = useMemo(() => {
    const layer = new MVTLayer({
      data: `http://localhost:9090/${species}/{z}/{x}/{y}.pbf`,
      minZoom: 0,
      maxZoom: 8,
      pointType: 'circle',
      getPointRadius: () => {
        // TODO Need more ad-hoc rule depending on grid size
        return ((MAX_ZOOM - viewState.zoom) / MAX_ZOOM) * 20000
      },
      getFillColor: (d: Cell) => {
        const nat = d.properties.nat_1
        if (timeStep === '2005') {
          if (nat === 1) {
            return [0, 150, 0]
          }
        } else {
          const probKey = FUT_BY_TIME_STEP[timeStep]
          const prob = d.properties[probKey]
          if (nat === 1) {
            if (prob < 500) {
              // decolonized
              return [255, 0, 0]
            } else {
              // stable
              return [0, 150, 0]
            }
          } else {
            if (prob > 500) {
              // suitable
              return [0, 255, 0]
            }
          }
        }
        return [0, 0, 0, 0]
      },
      updateTriggers: {
        // This tells deck.gl to recalculate fill color when `timeStep` changes
        getFillColor: timeStep,
      },
    })

    const layers = [basemap, layer]
    return layers
  }, [timeStep, species, viewState.zoom])

  return (
    <Fragment>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        viewState={viewState}
        onViewStateChange={onViewStateChange as any}
        layers={layers}
      />
      <div className="ui">
        <div>z: {viewState.zoom}</div>
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
    </Fragment>
  )
}

export default App
