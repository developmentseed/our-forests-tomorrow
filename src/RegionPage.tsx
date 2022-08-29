import { Dispatch, SetStateAction, useMemo } from 'react'
import { RegionFeature, StatsBySpecies } from './types'

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
  const currentStats = useMemo(() => {
    return Object.fromEntries(
      Object.entries(stats).map(([spc, spcStats]) => {
        const spcStatsForRegion = spcStats[region.properties.fid]
        return [spc, spcStatsForRegion]
      })
    )
  }, [region, stats])
  console.log('region stats:', currentStats, region.properties)
  return (
    <header>
      <h1>
        {region.properties.name_en}{' '}
        <button className="back" onClick={onRegionClose}></button>
      </h1>
      <p>Lorem Ipsum, dolor sit amet</p>
    </header>
  )
}

export default RegionPage
