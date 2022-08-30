import React, {
  ChangeEvent,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
} from 'react'
import { TimeStep } from '../types'
import './MapControls.css'

export type MapControlsProps = {
  children: ReactNode
  // timeStep: TimeStep
  // onTimestepChange: Dispatch<SetStateAction<TimeStep>>
}

function MapControls({ children }: MapControlsProps) {
  // const onTimestepChangeCallback = useCallback(
  //   (e: ChangeEvent<HTMLInputElement>) => {
  //     onTimestepChange(e.target.value.toString() as TimeStep)
  //   },
  //   [onTimestepChange]
  // )
  return (
    <div className="timestep">
      {/* <input
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
      {timeStep} */}
      {children}
    </div>
  )
}

export default MapControls
