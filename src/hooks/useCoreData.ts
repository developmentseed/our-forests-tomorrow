import { useEffect, useState } from 'react'
import {
  Region,
  StatsBySpecies,
  ValuesByRegionGID,
  ValuesByYear,
} from '../types'

function useCoreData() {
  const [stats, setStats] = useState<StatsBySpecies | null>(null)
  const [speciesDetail, setSpeciesDetail] = useState<any>(null)
  const [regions, setRegions] = useState<Region[]>([])
  useEffect(() => {
    if (stats) return
    Promise.all(
      ['./stats.json', './species_detail.json', './regions.json'].map((url) =>
        fetch(url).then((resp) => resp.json())
      )
    ).then((data) => {
      const [stats, speciesDetail, regions] = data
      setSpeciesDetail(speciesDetail)
      console.log(speciesDetail)

      const regionsWithLabels = (regions as Region[]).map((r) => {
        return {
          ...r,
          label: r.GID_1 ? `${r.NAME_1} (${r.COUNTRY})` : r.COUNTRY,
        }
      })

      // attach regions and species meta to stats
      const statsWithRegions = Object.fromEntries(
        Object.entries(stats as StatsBySpecies).map(
          ([species, speciesStats]: [string, ValuesByRegionGID]) => {
            const regionEntries = Object.entries(speciesStats).map(
              ([regionGID, regionStats]: [string, ValuesByYear]) => {
                const region = regionsWithLabels.find(
                  (r: Region) =>
                    r.GID_1 === regionGID || (!r.GID_1 && r.GID_0 === regionGID)
                )
                const speciesDetailForStats = speciesDetail[species]
                return [
                  regionGID,
                  {
                    ...regionStats,
                    region,
                    speciesDetail: {
                      name: speciesDetailForStats?.en?.aliases?.[0],
                    },
                  } as ValuesByYear,
                ]
              }
            )
            return [species, Object.fromEntries(regionEntries)]
          }
        )
      )
      setStats(statsWithRegions as StatsBySpecies)
      setRegions(regionsWithLabels)
    })
  }, [stats])
  return { stats, speciesDetail, regions }
}

export default useCoreData
