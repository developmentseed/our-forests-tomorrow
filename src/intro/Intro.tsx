import { useSetAtom } from 'jotai'
import { ReactNode, useCallback, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import {
  introCompletedAtom,
  introIntersectionRatioAtom,
  introStepAtom,
} from '../atoms'
import SpeciesMenuContent from '../nav/SpeciesMenuContent'
import { AllSpeciesData } from '../types'
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
  threshold?: number | number[]
}

function IntroSection({ id, children, threshold = 0.5 }: IntroSectionProps) {
  const setIntroStep = useSetAtom(introStepAtom)
  const setIntroIntersectionRatio = useSetAtom(introIntersectionRatioAtom)

  const { ref, inView, entry } = useInView({
    threshold,
  })

  if (entry) {
    setIntroIntersectionRatio(entry?.intersectionRatio)
  }

  useEffect(() => {
    if (inView) setIntroStep(id)
  }, [id, setIntroStep, inView])
  return <IntroSectionWrapper ref={ref}>{children}</IntroSectionWrapper>
}

type IntroProps = {
  species: AllSpeciesData
}

const CONTINUOUS_THRESHOLDS = Array(100)
  .fill(0)
  .map((_, i) => i / 100)

function Intro({ species }: IntroProps) {
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
          Forests cover 35% of EU land Value of forests <br />
          Under threat from pests, habitat fragmentation, invasive species,
          climate change, water scarcity, fires, storms
        </IntroForests>
      </IntroSection>
      <IntroSection id={IntroStepEnum.Species}>
        <IntroSpecies>
          <SpeciesMenuContent species={species}>
            A large number (67) of tree species blah blih blouh
          </SpeciesMenuContent>
        </IntroSpecies>
      </IntroSection>
      <IntroSection id={IntroStepEnum.Map} threshold={CONTINUOUS_THRESHOLDS}>
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
