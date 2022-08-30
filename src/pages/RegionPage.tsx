import { Dispatch, SetStateAction } from 'react'
import StatsDropdown from '../components/StatsDropdown'
import { useAllSpeciesStatsForRegion, useStats } from '../hooks/useStats'
import { RegionFeature, StatsBySpecies, ValuesBySpeciesID } from '../types'

export type RegionPageProps = {
  region: RegionFeature
  species: string
  stats: StatsBySpecies
  onRegionClose: Dispatch<SetStateAction<any>>
}

function RegionPage({
  region,
  species,
  stats,
  onRegionClose,
}: RegionPageProps) {
  const currentStats: ValuesBySpeciesID = useAllSpeciesStatsForRegion(
    region,
    stats
  )

  const naturallyPresent = useStats(currentStats, 'bySpecies')

  // console.log('region stats:', currentStats, region.properties)
  // console.log(naturallyPresent)
  return (
    <header>
      <h1>
        {region.properties.name_en}{' '}
        <button className="back" onClick={onRegionClose}></button>
      </h1>
      <div>
        In {region.properties.name_en},{' '}
        <StatsDropdown
          data={naturallyPresent}
          color={[0, 255, 0]}
          labelKey="species"
        />
      </div>
    </header>
  )
}

export default RegionPage
