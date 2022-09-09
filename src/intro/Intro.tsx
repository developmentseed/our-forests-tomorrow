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
  IntroChart,
  IntroDecolonization,
  IntroForests,
  IntroMap,
  IntroRegionMap,
  IntroRegionPage,
  IntroSectionWrapper,
  IntroSpecies,
  IntroSpeciesExampleMap,
  IntroSpeciesExamplePage,
  IntroSuitable,
  IntroTimesteps,
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
  // Current,
  Timesteps,
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
          Covering 35% of EU land1, forests play a fundamental economic and
          ecological role. Besides their obvious contribution to biodiversity
          and the provision of wood and non-wood products, forests maintain a
          wide range of ecosystem services, such as carbon storage and
          sequestration, habitat provision, and water regulation. Nonetheless,
          forests are increasingly under threat from habitat fragmentation, the
          spread of invasive alien spe- cies, climate change, water scarcity,
          fires, storms, and pests. By the end of the century, climate change
          alone will substantially alter the current distribution of
          climatically suitable areas for the majority of European trees
          species, generating severe mismatches between species' niches and the
          local climatic conditions. This might result in both the erosion of
          current species ranges and colonization of newly suitable areas.
        </IntroForests>
      </IntroSection>
      <IntroSection id={IntroStepEnum.Species}>
        <IntroSpecies>
          <SpeciesMenuContent species={species}>
            Previous studies aiming at investigating the impact of climate
            change on tree species in Europe largely focused on few (&gt; 15)
            commercially important tree species. This might result in excluding
            tree species important for biodiversity, ecosystem functioning,
            wildlife habitat, and in turn ecosystem services. However, there is
            now increasing evidence that, in a climate change context, a greater
            number of plant species is vital to reduce vulnerability, guarantee
            ecosystem functioning and the future delivery of ecosystem services.
            In fact, tree diversity is key to enhancing resilience of forest
            communities to climate-driven risks and disturbances, in particular
            when environmental conditions are rapidly changing. Therefore,
            EU-Trees4F provides a more comprehensive view by mapping current and
            future ranges for a large number (67) of European tree species.
          </SpeciesMenuContent>
        </IntroSpecies>
      </IntroSection>
      <IntroSection id={IntroStepEnum.Map} threshold={CONTINUOUS_THRESHOLDS}>
        <IntroMap>
          Previous projections of future tree species ranges typically relied on
          bioclimatic parameters downscaled from coarse (grid cells greater than
          100 km) simulations by one or more global climate models. Conversely,
          EU-Trees4F takes advantage of outputs of regional climate models at a
          higher spatial resolution which have now become available.
          <br />
          This gives detailed insight at the region level.
        </IntroMap>
      </IntroSection>
      <IntroSection id={IntroStepEnum.SpeciesExamplePage}>
        <IntroSpeciesExamplePage>
          Let's have a look at one of the 67 species: Quercus Ilex
        </IntroSpeciesExamplePage>
      </IntroSection>
      <IntroSection id={IntroStepEnum.SpeciesExampleMap} threshold={0.8}>
        <IntroSpeciesExampleMap>
          Quercus Ilex is typically a mediterranean species
          <br /> Start explaining legend Natural distribution of Quercus Ilex
        </IntroSpeciesExampleMap>
      </IntroSection>
      <IntroSection
        id={IntroStepEnum.Timesteps}
        threshold={[0.4, 0.6, 0.8, 0.99]}
      >
        <IntroTimesteps>
          By the end of the century, climate change alone will substantially
          alter the current distribution of climatically suitable areas for the
          majority of European trees species, generating severe mismatches
          between species' niches and the local climatic conditions.
          <br />
          To the model projections in future climates, we applied the same
          30-year time difference, as we had for the current projection, which
          was simulated with a climatology centred on the year 1975 but was
          referring to forest occurrences collected around the year 2005. The
          rationale behind this is that the tree occurrences in the calibration
          data set were recorded in the landscape around the year 2005 but
          mostly established themselves under the climatic conditions of the
          previous decades. Therefore, we assumed that the distribution of a
          species around the years 2035, 2065, and 2095 is predominantly
          constrained by the climatic conditions of the previous 30 years too.
        </IntroTimesteps>
      </IntroSection>
      <IntroSection id={IntroStepEnum.Decolonization}>
        <IntroDecolonization>
          Largely going to disappear from areas such as Spain where it's
          emblematical
          <br />
          ‘Decolonized’, indicates areas that will become climatically
          unsuitable by the end of the century.
        </IntroDecolonization>
      </IntroSection>
      <IntroSection id={IntroStepEnum.Suitable}>
        <IntroSuitable>
          But could be implementend in wester France, England...
          <br />
          Informing forest adaptation strategies based on assisted tree
          migration
          <br />
          In fact, the projected decline in tree species richness by the end of
          the 21st century, might provide spatial information to foresters and
          practitioners concerning the areas that may require assisted
          recolonization.
          <br />
          We envisage that EU-Trees4F will facilitate active forest man- agement
          for climate adaptation (including assisted colonization strategies)41
          that addresses the balance between economic forest productivity (which
          currently hinges on rather few commercially exploited tree species) in
          the shorter or longer-term, the provision of non-economic ecosystem
          services, and the resilience of forest eco- systems to future
          environmental perturbations.
          <br />
        </IntroSuitable>
      </IntroSection>
      <IntroSection id={IntroStepEnum.Chart}>
        <IntroChart>
          We can represent the data shown in the map as a timeline, where
          possible futures "branch"
        </IntroChart>
      </IntroSection>
      <IntroSection id={IntroStepEnum.RegionMap}>
        <IntroRegionMap>
          "This tool also allows one to look at the panorama of species for a
          given European region. For example... "<br />
          While Quercus Ilex mostly disappears fromn Spain....
        </IntroRegionMap>
      </IntroSection>
      <IntroSection id={IntroStepEnum.RegionPage}>
        <IntroRegionPage>
          We can see that other species might thrive...
        </IntroRegionPage>
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
