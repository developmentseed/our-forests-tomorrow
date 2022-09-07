import { useSetAtom } from 'jotai'
import { ReactNode, useCallback, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { introCompletedAtom, introStepAtom } from '../atoms'
import {
  IntroForests,
  IntroMap,
  IntroRegionPage,
  IntroSectionWrapper,
  IntroSpecies,
  IntroSpeciesExampleMap,
  IntroSpeciesExamplePage,
  IntroTitle,
  IntroUIExplanation,
  IntroWrapper,
} from './Intro.styled'

export enum IntroStepEnum {
  Title,
  Forests,
  Species,
  Map,
  SpeciesExamplePage,
  SpeciesExampleMap,
  Timesteps,
  Current,
  Decolonization,
  Suitable,
  Chart,
  RegionMap,
  RegionPage,
  UIExplanation,
}
type IntroSectionProps = {
  id: IntroStepEnum
  children: ReactNode
}

function IntroSection({ id, children }: IntroSectionProps) {
  const setIntroStep = useSetAtom(introStepAtom)

  const { ref, inView, entry } = useInView({
    threshold: 0.9,
  })

  // console.log(entry)

  useEffect(() => {
    if (inView) setIntroStep(id)
  }, [id, setIntroStep, inView])
  return <IntroSectionWrapper ref={ref}>{children}</IntroSectionWrapper>
}

function Intro() {
  const setIntroCompleted = useSetAtom(introCompletedAtom)
  const onDismissClicked = useCallback(() => {
    setIntroCompleted(true)
  }, [setIntroCompleted])
  return (
    <IntroWrapper>
      <IntroSection id={IntroStepEnum.Title}>
        <IntroTitle>
          <h1>Our Forests Tomorrow</h1>
        </IntroTitle>
      </IntroSection>
      <IntroSection id={IntroStepEnum.Forests}>
        <IntroForests>
          Forests cover 35% of EU land Value of forests Under threat from pests,
          habitat fragmentation, invasive species, climate change, water
          scarcity, fires, storms
        </IntroForests>
      </IntroSection>
      <IntroSection id={IntroStepEnum.Species}>
        <IntroSpecies>A large number (67) of tree species</IntroSpecies>
      </IntroSection>
      <IntroSection id={IntroStepEnum.Map}>
        <IntroMap>Study precision</IntroMap>
      </IntroSection>
      <IntroSection id={IntroStepEnum.SpeciesExamplePage}>
        <IntroSpeciesExamplePage>Hello Quercus</IntroSpeciesExamplePage>
      </IntroSection>
      <IntroSection id={IntroStepEnum.SpeciesExampleMap}>
        <IntroSpeciesExampleMap>Hello quercus map</IntroSpeciesExampleMap>
      </IntroSection>
      <IntroSection id={IntroStepEnum.RegionPage}>
        <IntroRegionPage>region</IntroRegionPage>
      </IntroSection>
      <IntroSection id={IntroStepEnum.UIExplanation}>
        <IntroUIExplanation>
          UIExplanation
          <button onClick={onDismissClicked}>dismiss</button>
        </IntroUIExplanation>
      </IntroSection>
    </IntroWrapper>
  )
}

export default Intro
