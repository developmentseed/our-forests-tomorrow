import { useMemo } from 'react'
import InlineDropdown from './components/InlineDropdown'
import { SPECIES_COLORS } from './constants'
import { Region, StatsBySpecies } from './types'
import { deckColorToCss } from './utils'

export type SpeciesStatsProps = {
  species: string
  stats: StatsBySpecies
  speciesDetail: any
  regions: Region[]
}

function SpeciesStats({
  species,
  stats,
  speciesDetail,
  regions,
}: SpeciesStatsProps) {
  const currentStats = stats[species]
  const detail = speciesDetail[species]
  const name = detail.en.aliases[0]
  console.log('species stats:', currentStats, regions)
  const naturallyPresent = useMemo(() => {
    const arr = Object.entries(currentStats)
    const ordered = arr.sort((a, b) => {
      console.log(a, b)
      return 0
    })
    return ordered
  }, [regions, currentStats])
  console.log(naturallyPresent)
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
        <InlineDropdown data={['Bretagne', 'Murcia', 'Portugal', 'Slovenia']} />
      </p>
      <p>{detail.en.extract}</p>
    </header>
  )
}

export default SpeciesStats
