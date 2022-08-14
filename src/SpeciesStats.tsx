import InlineDropdown from './components/InlineDropdown'
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
  const name = detail.en.aliases[0]
  console.log('species stats:', currentStats)
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
        {name} currently grows in{' '}
        <InlineDropdown data={['Bretagne', 'Murcia', 'Portugal', 'Slovenia']} />
      </p>
      <p>{detail.en.extract}</p>
    </header>
  )
}

export default SpeciesStats
