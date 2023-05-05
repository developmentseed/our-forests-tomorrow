import { useAtom } from 'jotai'
import React from 'react'
import { timeStepAtom } from '../atoms'
import { ButtonBar, Button } from '../components/ButtonBar.styled'
import { TIME_STEPS } from '../constants'
import {
  MapTopControlsSection,
  MapTopControlsSectionTitle,
  MapTopControlsWrapper,
} from './MapTopControls.styled'

function MapTopControls() {
  const [currentTimestep, setCurrentTimestep] = useAtom(timeStepAtom)
  return (
    <MapTopControlsWrapper>
      <MapTopControlsSection>
        <MapTopControlsSectionTitle>
          Climate scenario
        </MapTopControlsSectionTitle>
        <ButtonBar>
          <Button active>rcp4.5<em> · Emissions peak mid-century</em></Button>
          <Button>rcp8.5<em> · Business as usual</em></Button>
        </ButtonBar>
      </MapTopControlsSection>
      <MapTopControlsSection>
        <MapTopControlsSectionTitle>Year</MapTopControlsSectionTitle>
        <ButtonBar>
          {TIME_STEPS.map((timestep) => (
            <Button
              onMouseDown={() => setCurrentTimestep(timestep)}
              active={currentTimestep === timestep}
              key={timestep}
            >
              {timestep}
            </Button>
          ))}
        </ButtonBar>
      </MapTopControlsSection>
    </MapTopControlsWrapper>
  )
}

export default MapTopControls
