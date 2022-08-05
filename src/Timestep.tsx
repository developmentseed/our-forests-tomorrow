import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
} from 'react'
import { TimestepContext } from './App'
import { TimeStep } from './types'
import './Timestep.css'

export type TimestepProps = {
  timeStep: TimeStep
  onTimestepChange: Dispatch<SetStateAction<TimeStep>>
}

function Timestep({ timeStep, onTimestepChange }: TimestepProps) {
  const onTimestepChangeCallback = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onTimestepChange(e.target.value.toString() as TimeStep)
    },
    [onTimestepChange]
  )
  return (
    <div className="timestep">
      <input
        type="range"
        list="tickmarks"
        min="2005"
        max="2095"
        step="30"
        onChange={onTimestepChangeCallback}
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
  )
}

export default Timestep
