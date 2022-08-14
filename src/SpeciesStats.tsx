import { SPECIES_COLORS } from './constants'
import { StatsBySpecies } from './types'
import { deckColorToCss } from './utils'

export type SpeciesStatsProps = {
  species: string
  stats: StatsBySpecies
  speciesDetail: any
}

function SpeciesStats({ species, stats, speciesDetail }: SpeciesStatsProps) {
  const currentStats = stats[species]
  const detail = speciesDetail[species]
  console.log('species stats:', currentStats)
  return (
    <header>
      <h1
        style={{
          color: deckColorToCss(SPECIES_COLORS[species]),
        }}
      >
        {species}, {detail.en.aliases[0]}
      </h1>
      <p>{detail.en.extract}</p>
    </header>
  )
}

export default SpeciesStats
