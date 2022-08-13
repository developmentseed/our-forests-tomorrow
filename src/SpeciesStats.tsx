import { SPECIES_COLORS } from './constants'
import { StatsBySpecies } from './types'
import { deckColorToCss } from './utils'

export type SpeciesStatsProps = {
  species: string
  stats: StatsBySpecies
}

function SpeciesStats({ species, stats }: SpeciesStatsProps) {
  const currentStats = stats[species]
  console.log('species stats:', currentStats)
  return (
    <header>
      <h1
        style={{
          color: deckColorToCss(SPECIES_COLORS[species]),
        }}
      >
        {species}
      </h1>
      <p>Lorem Ipsum, dolor sit amet</p>
    </header>
  )
}

export default SpeciesStats
