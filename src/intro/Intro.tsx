import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { ReactNode, useCallback, useEffect } from 'react'
import { Trans } from 'react-i18next'
import { useInView } from 'react-intersection-observer'
import {
  introCompletedAtom,
  introIntersectionRatioAtom,
  introStepAtom,
} from '../atoms'
import { TimestepButton } from '../components/Button.styled'
import { Logo } from '../components/Logo.styled'
import SpeciesMenuContent from '../nav/SpeciesMenuContent'
import { AllSpeciesData } from '../types'
import {
  IntroChart,
  IntroDecolonization,
  IntroForests,
  IntroForests2,
  IntroMap,
  IntroRegionMap,
  IntroRegionPage,
  IntroSectionWrapper,
  IntroSpecies,
  IntroSpecies2,
  IntroSpecies3,
  IntroSpeciesExampleMap,
  IntroSpeciesExamplePage,
  IntroSuitable,
  IntroTimesteps,
  IntroTitle,
  IntroUIExplanation,
  IntroWrapper,
} from './Intro.styled'
import IntroSpeciesList from './IntroSpecies'

export enum IntroStepEnum {
  Title,
  Forests,
  Forests2,
  Species,
  Species2,
  Species3,
  Map,
  SpeciesExamplePage,
  SpeciesExampleMap,
  Timesteps,
  Timesteps2,
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
  height?: string
  threshold?: number | number[]
}

function IntroSection({
  id,
  children,
  threshold = 0.5,
  height,
}: IntroSectionProps) {
  const setIntroStep = useSetAtom(introStepAtom)
  const [introIntersectionRatio, setIntroIntersectionRatio] = useAtom(
    introIntersectionRatioAtom
  )

  const { ref, inView, entry } = useInView({
    threshold,
  })

  useEffect(() => {
    if (entry) {
      // if (id === IntroStepEnum.Title) {
      //   console.log(entry.boundingClientRect.top)
      // }
      setIntroIntersectionRatio({
        ...introIntersectionRatio,
        [id]: entry.intersectionRatio,
      })
      // {...entry.intersectionRatio)
    }
  }, [entry?.intersectionRatio, setIntroIntersectionRatio])

  useEffect(() => {
    if (inView) setIntroStep(id)
  }, [id, setIntroStep, inView])
  return (
    <IntroSectionWrapper ref={ref} height={height}>
      {children}
    </IntroSectionWrapper>
  )
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
  const introIntersectionRatio = useAtomValue(introIntersectionRatioAtom)
  // console.log(introIntersectionRatio)

  return (
    <IntroWrapper>
      <IntroSection
        id={IntroStepEnum.Title}
        threshold={CONTINUOUS_THRESHOLDS}
        height="200vh"
      >
        <IntroTitle>
          <Logo>
            <Trans i18nKey="nav.title" components={{ b: <span /> }} />
          </Logo>
        </IntroTitle>
      </IntroSection>
      <IntroSection id={IntroStepEnum.Forests}>
        <IntroForests>
          Covering 35% of EU land, forests play a fundamental economic and
          ecological role. Besides their obvious contribution to biodiversity
          and the provision of wood and non-wood products, forests maintain a
          wide range of ecosystem services, such as carbon storage and
          sequestration, habitat provision, and water regulation. Nonetheless,
          forests are increasingly under threat from habitat fragmentation, the
          spread of invasive alien species, climate change, water scarcity,
          fires, storms, and pests.
        </IntroForests>
      </IntroSection>
      <IntroSection id={IntroStepEnum.Forests2}>
        <IntroForests2>
          By the end of the century, climate change alone will substantially
          alter the current distribution of climatically suitable areas for the
          majority of European trees species, generating severe mismatches
          between species' niches and the local climatic conditions. This might
          result in both the erosion of current species ranges and colonization
          of newly suitable areas.
        </IntroForests2>
      </IntroSection>
      <IntroSection id={IntroStepEnum.Species}>
        <IntroSpecies>
          Previous studies aiming at investigating the impact of climate change
          on tree species in Europe largely focused on few (&gt; 15)
          commercially important tree species. This might result in excluding
          tree species important for biodiversity, ecosystem functioning,
          wildlife habitat, and in turn ecosystem services.
        </IntroSpecies>
      </IntroSection>
      <IntroSection id={IntroStepEnum.Species2}>
        <IntroSpecies2>
          <IntroSpeciesList species={species} />
        </IntroSpecies2>
      </IntroSection>
      <IntroSection id={IntroStepEnum.Species3}>
        <IntroSpecies3>
          However, there is now increasing evidence that, in a climate change
          context, a greater number of plant species is vital to reduce
          vulnerability, guarantee ecosystem functioning and the future delivery
          of ecosystem services. In fact, tree diversity is key to enhancing
          resilience of forest communities to climate-driven risks and
          disturbances, in particular when environmental conditions are rapidly
          changing. Therefore, EU-Trees4F provides a more comprehensive view by
          mapping current and future ranges for a large number (67) of European
          tree species.
        </IntroSpecies3>
      </IntroSection>
      <IntroSection id={IntroStepEnum.Map} threshold={CONTINUOUS_THRESHOLDS}>
        <IntroMap>
          Previous projections of future tree species ranges typically relied on
          bioclimatic parameters downscaled from coarse (grid cells greater than
          100 km) simulations by one or more global climate models. Conversely,
          EU-Trees4F takes advantage of outputs of regional climate models at a
          higher spatial resolution which have now become available.
        </IntroMap>
      </IntroSection>
      <IntroSection id={IntroStepEnum.SpeciesExamplePage}>
        <IntroSpeciesExamplePage>
          Let's have a look on the map at one of the 67 species of the study:
          the Holm Oak (<em>Quercus Ilex</em>).
        </IntroSpeciesExamplePage>
      </IntroSection>
      <IntroSection id={IntroStepEnum.SpeciesExampleMap} threshold={0.8}>
        <IntroSpeciesExampleMap>
          The Holm oak is a large evergreen oak native to the Mediterranean
          region. It grows in pure stands or mixed forest in the Mediterranean
          and often at low or moderate elevations.
        </IntroSpeciesExampleMap>
      </IntroSection>
      <IntroSection id={IntroStepEnum.Timesteps}>
        <IntroTimesteps>
          By the end of the century, climate change alone will substantially
          alter the current distribution of climatically suitable areas for the
          majority of European trees species, generating severe mismatches
          between species' niches and the local climatic conditions.
        </IntroTimesteps>
      </IntroSection>
      <IntroSection id={IntroStepEnum.Timesteps2}>
        <IntroTimesteps>
          Here's the projected distribution of the Holm oak in 2095 under the
          RCP 8.5 scenario. Light green areas indicate where the species might
          be able to colonize, dark green where the species will be able to
          maintain its presence, and red areas where the species will become
          climatically unsuitable.
        </IntroTimesteps>
      </IntroSection>
      <IntroSection id={IntroStepEnum.Decolonization}>
        <IntroDecolonization>
          Warmer, drier conditions are slowly driving the Holm oak forests in
          Spain to extinction. Understanding how the forests in this area are
          expected to change and identifying alternative species that are more
          suited for these drier conditions will be essential to building more
          resilient forests and adapting to future climatic conditions.
        </IntroDecolonization>
      </IntroSection>
      <IntroSection id={IntroStepEnum.Suitable}>
        <IntroSuitable>
          The projected decline in tree species richness by the end of the 21st
          century might provide spatial information to foresters and
          practitioners concerning the areas that may require assisted
          recolonization. For example, the Holm oak is projected to become
          climatically suitable in parts of France, England, etc.
        </IntroSuitable>
      </IntroSection>
      {/* <IntroSection id={IntroStepEnum.Chart}>
        <IntroChart>
          We can represent the data shown in the map as a timeline, where
          possible futures "branch"
        </IntroChart>
      </IntroSection> */}
      <IntroSection id={IntroStepEnum.RegionMap}>
        <IntroRegionMap>
          This tool also allows one to look at the panorama of species for a
          given European region. For example, going back to Spain, we can see an
          opportunity for Olive trees to be planted in the Castile and León
          region.
        </IntroRegionMap>
      </IntroSection>
      {/* <IntroSection id={IntroStepEnum.RegionPage}>
        <IntroRegionPage>
          We can see that other species might thrive...
        </IntroRegionPage>
      </IntroSection> */}
      <IntroSection id={IntroStepEnum.UIExplanation}>
        <IntroUIExplanation>
          Use the menu bar above to select a specific species; you can then
          navigate the timeline and switch RCP scenarios to visualize the extent
          of the species on the map. You can also choose to pick a specific
          European country or region.
          <TimestepButton selected={true} onClick={onDismissClicked}>
            Continue
          </TimestepButton>
        </IntroUIExplanation>
      </IntroSection>
    </IntroWrapper>
  )
}

export default Intro
