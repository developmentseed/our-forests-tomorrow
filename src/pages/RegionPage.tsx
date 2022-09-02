import { Dispatch, SetStateAction } from 'react'
import StatsDropdown from './StatsDropdown'
import { useAllSpeciesStatsForRegion, useStats } from '../hooks/useStats'
import { RegionFeature, StatsBySpecies, ValuesBySpeciesID } from '../types'
import { Title } from './Page.styled'

export type RegionPageProps = {
  region: RegionFeature
  stats: StatsBySpecies
  onRegionClose: Dispatch<SetStateAction<any>>
}

function RegionPage({ region, stats, onRegionClose }: RegionPageProps) {
  const currentStats: ValuesBySpeciesID = useAllSpeciesStatsForRegion(
    region,
    stats
  )

  const naturallyPresent = useStats(currentStats, 'bySpecies')

  // console.log('region stats:', currentStats, region.properties)
  // console.log(naturallyPresent)
  return (
    <header>
      <Title>
        {region.properties.name_en}{' '}
        <button className="back" onClick={onRegionClose}></button>
      </Title>
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
