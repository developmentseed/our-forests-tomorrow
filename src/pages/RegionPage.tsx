import { Dispatch, SetStateAction } from 'react'
import StatsDropdown from './StatsDropdown'
import { useAllSpeciesStatsForRegion, useStats } from '../hooks/useStats'
import { Region, StatsBySpecies, ValuesBySpeciesID } from '../types'
import { Title } from './Page.styled'

export type RegionPageProps = {
  currentRegionData: Region
  stats: StatsBySpecies
  onRegionClose: Dispatch<SetStateAction<any>>
}

function RegionPage({
  currentRegionData,
  stats,
  onRegionClose,
}: RegionPageProps) {
  const currentStats: ValuesBySpeciesID = useAllSpeciesStatsForRegion(
    currentRegionData,
    stats
  )

  const naturallyPresent = useStats(currentStats, 'bySpecies')

  // console.log('region stats:', currentStats, region.properties)
  // console.log(naturallyPresent)
  return (
    <header>
      <Title>
        {currentRegionData.NAME_1}{' '}
        <button className="back" onClick={onRegionClose}></button>
      </Title>
      <div>
        In {currentRegionData.NAME_1},{' '}
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
