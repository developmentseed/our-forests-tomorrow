import React, { useState, Fragment, useCallback } from 'react'
import './App.css'
import SpeciesChoice from './SpeciesChoice'
import Map from './Map'
import Timestep from './Timestep'
import { RegionFeature, TimeStep } from './types'
import { deckColorToCss } from './utils'
import { SPECIES_COLORS } from './constants'
import { Feature } from 'geojson'
import Timeseries from './Timeseries'
import { SPECIES_WHITELIST } from './constants_common'

function App() {
  const [timeStep, setTimeStep] = useState<TimeStep>('2005')
  const [species, setSpecies] = useState<string>(
    SPECIES_WHITELIST[Math.floor(SPECIES_WHITELIST.length * Math.random())]
  )
  const [region, setRegion] = useState<RegionFeature | null>(null)
  const [renderedFeatures, setRenderedFeatures] = useState<
    undefined | Feature[]
  >(undefined)

  const closeRegion = useCallback(() => {
    setRegion(null)
  }, [setRegion])

  return (
    <Fragment>
      <header>
        <h1
          style={{
            color: deckColorToCss(SPECIES_COLORS[species]),
          }}
        >
          {species}
        </h1>
        <p>Lorem Ipsum, dolor sit amet</p>
      </header>
      <Map
        timeStep={timeStep}
        species={species}
        region={region}
        onRegionChange={setRegion}
        onRenderedFeaturesChange={setRenderedFeatures}
      />
      <Timestep>
        <Timeseries
          timeStep={timeStep}
          onTimestepChange={setTimeStep}
          features={renderedFeatures}
          species={species}
        />
      </Timestep>
      <SpeciesChoice
        species={species}
        region={region}
        onSpeciesChange={setSpecies}
        onRegionClose={closeRegion}
      />
    </Fragment>
  )
}

export default App
