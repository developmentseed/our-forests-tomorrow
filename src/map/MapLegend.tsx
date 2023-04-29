import { useAtomValue } from 'jotai'
import { introCompletedAtom, introStepAtom } from '../atoms'
import Legend from '../components/Legend'
import { IntroStepEnum } from '../intro/Intro'
import { MapLegendsWrapper } from './MapLegend.styled'


function MapLegend() {
  const introStep = useAtomValue(introStepAtom)
  const introCompleted = useAtomValue(introCompletedAtom)
  return (
    <MapLegendsWrapper
      visible={introCompleted || introStep >= IntroStepEnum.SpeciesExamplePage}
    >
      <Legend />
    </MapLegendsWrapper>
  )
}

export default MapLegend
