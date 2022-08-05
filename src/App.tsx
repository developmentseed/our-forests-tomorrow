import React, { useState, Fragment, useMemo } from 'react'
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
  const [timeStep, setTimeStep] = useState('2005')
  const timeStepValue = useMemo(
    () => ({ timeStep, setTimeStep } as any),
    [timeStep]
  )
  // const [species, setSpecies] = useState<string>('Fraxinus_excelsior')
  // const onSpeciesChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
  //   setSpecies(e.target.value)
  // }, [])

  return (
    <Fragment>
      <TimestepContext.Provider value={timeStepValue}>
        <Map species="Fraxinus_excelsior" />
        <Timestep />
      </TimestepContext.Provider>
      <SpeciesChoice />
    </Fragment>
  )
}

export default App
