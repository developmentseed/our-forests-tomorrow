import { useMemo } from 'react'
import InlineDropdown from './components/InlineDropdown'
import { COUNTRIES_WITH_REGIONS_GIDS, SPECIES_COLORS } from './constants'
import { Region, StatsBySpecies, ValuesByYear } from './types'
import { deckColorToCss } from './utils'

export type SpeciesStatsProps = {
  species: string
  stats: StatsBySpecies
  speciesDetail: any
}

function SpeciesStats({ species, stats, speciesDetail }: SpeciesStatsProps) {
  const currentStats = stats[species]
  const detail = speciesDetail[species]
  const name = detail.en.aliases[0]
  // console.log('species stats:', currentStats)
  const naturallyPresent = useMemo(() => {
    const arr = Object.entries(currentStats)
    const ordered = arr.sort((a, b) => {
      return b[1][2005] - a[1][2005]
    })
    const filtered = ordered.filter(
      ([GID]: [string, ValuesByYear]) =>
        !COUNTRIES_WITH_REGIONS_GIDS.includes(GID)
    )
    return filtered
  }, [currentStats])

  return (
    <header>
      <h1
        style={{
          color: deckColorToCss(SPECIES_COLORS[species]),
        }}
      >
        {species}, {name}
      </h1>
      <p>
        {name} is naturally present in{' '}
        <InlineDropdown data={naturallyPresent} />
      </p>
      <p>{detail.en.extract}</p>
    </header>
  )
}

export default SpeciesStats
