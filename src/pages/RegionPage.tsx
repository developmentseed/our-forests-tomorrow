import { Dispatch, SetStateAction, useCallback } from 'react'
import StatsDropdown from './StatsDropdown'
import { useAllSpeciesStatsForRegion, useStats } from '../hooks/useStats'
import {
  Region,
  StatsBySpecies,
  ValuesBySpeciesID,
  ValuesByYear,
} from '../types'
import { Page, PageContents, Title } from './Page.styled'
import { CloseButton } from '../components/Button.styled'
import { useSetAtom } from 'jotai'
import { currentSpeciesAtom } from '../atoms'

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

  const setCurrentSpecies = useSetAtom(currentSpeciesAtom)
  const onSpeciesClick = useCallback(
    (d: ValuesByYear) => {
      const species = d.species
      if (!species) return
      setCurrentSpecies(species)
    },
    [setCurrentSpecies]
  )

  // console.log('region stats:', currentStats, region.properties)
  // console.log(naturallyPresent)
  return (
    <Page>
      <Title>
        {currentRegionData.NAME_1}
        <CloseButton onClick={onRegionClose} />
      </Title>
      <PageContents>
        {/* In {currentRegionData.NAME_1},{' '}
        <StatsDropdown
          data={naturallyPresent}
          color={[0, 255, 0]}
          labelKey="species"
          onItemClick={onSpeciesClick}
        /> */}
      </PageContents>
    </Page>
  )
}

export default RegionPage
