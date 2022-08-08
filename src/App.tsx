import React, { useState, Fragment } from 'react'
import './App.css'
import SpeciesChoice from './SpeciesChoice'
import Map from './Map'
import Timestep from './Timestep'
import { TimeStep } from './types'
import { deckColorToCss } from './utils'
import { SPECIES_COLORS } from './constants'

function App() {
  const [timeStep, setTimeStep] = useState<TimeStep>('2005')

  const [species, setSpecies] = useState<string>('Fraxinus_excelsior')

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
      <Map timeStep={timeStep} species={species} />
      <Timestep timeStep={timeStep} onTimestepChange={setTimeStep} />
      <SpeciesChoice species={species} onSpeciesChange={setSpecies} />
    </Fragment>
  )
}

export default App
