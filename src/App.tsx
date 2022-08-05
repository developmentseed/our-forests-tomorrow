import React, { useState, Fragment } from 'react'
import './App.css'
import SpeciesChoice from './SpeciesChoice'
import Map from './Map'
import Timestep from './Timestep'
import { TimeStep } from './types'

export const TimestepContext = React.createContext({
  timeStep: '2005' as TimeStep,
  setTimeStep: (timeStep: TimeStep) => {},
})

function App() {
  const [timeStep, setTimeStep] = useState<TimeStep>('2005')

  const [species, setSpecies] = useState<string>('Fraxinus_excelsior')
  // const onSpeciesChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
  //   setSpecies(e.target.value)
  // }, [])

  return (
    <Fragment>
      <Map timeStep={timeStep} species={species} />
      <Timestep timeStep={timeStep} onTimestepChange={setTimeStep} />
      <SpeciesChoice species={species} onSpeciesChange={setSpecies} />
    </Fragment>
  )
}

export default App
