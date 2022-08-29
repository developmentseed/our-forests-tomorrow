import { Fragment, useMemo } from 'react'
import InlineDropdown from './components/InlineDropdown'
import StatsDropdown from './components/StatsDropdown'
import Timeseries from './components/Timeseries'
import {
  CellTypeEnum,
  COUNTRIES_WITH_REGIONS_GIDS,
  SPECIES_COLORS,
} from './constants'
import { useStatsByRegions } from './hooks/useStats'
import { Region, StatsBySpecies, ValuesByYear } from './types'
import { deckColorToCss } from './utils'

export type SpeciesPageProps = {
  species: string
  stats: StatsBySpecies
  speciesDetail: any
}

function SpeciesPage({ species, stats, speciesDetail }: SpeciesPageProps) {
  const currentStats = stats[species]
  const color = SPECIES_COLORS[species]
  const detail = speciesDetail[species]
  const name = detail?.en?.aliases?.[0]
  console.log('species stats:', currentStats)
  const naturallyPresent = useStatsByRegions(currentStats)
  const willDisappear = useStatsByRegions(
    currentStats,
    2095,
    'desc',
    CellTypeEnum.Decolonized
  )
  const couldThrive = useStatsByRegions(
    currentStats,
    2095,
    'desc',
    CellTypeEnum.Suitable
  )

  return (
    <header>
      <h1
        style={{
          color: deckColorToCss(SPECIES_COLORS[species]),
        }}
      >
        {species}, {name}
      </h1>
      <div>
        {name} is naturally present in{' '}
        <StatsDropdown data={naturallyPresent} color={color} />. By 2095, that
        species is likely to disappear from{' '}
        <StatsDropdown data={willDisappear} color={color} />. However, by 2095
        it could thrive in <StatsDropdown data={couldThrive} color={color} />
      </div>
      <p>{detail.en.extract}</p>
    </header>
  )
}

export default SpeciesPage
