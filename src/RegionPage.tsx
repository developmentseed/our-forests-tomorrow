import { useMemo } from 'react'
import { RegionFeature, StatsBySpecies } from './types'

export type RegionPageProps = {
  region: RegionFeature
  species: string
  stats: StatsBySpecies
}

function RegionPage({ region, species, stats }: RegionPageProps) {
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
      <h1>{region.properties.name_en}</h1>
      <p>Lorem Ipsum, dolor sit amet</p>
    </header>
  )
}

export default RegionPage
