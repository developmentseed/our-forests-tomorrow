import { useEffect, useState } from 'react'
import {
  AllSpeciesData,
  Region,
  SpeciesData,
  StatsBySpecies,
  ValuesByRegionGID,
  ValuesByYear,
} from '../types'

function useCoreData() {
  const [stats, setStats] = useState<StatsBySpecies | null>(null)
  const [speciesData, setSpeciesData] = useState<AllSpeciesData | null>(null)
  const [regions, setRegions] = useState<Region[]>([])
  useEffect(() => {
    if (stats) return
    Promise.all(
      ['./stats.json', './regions.json', './species_data.json'].map((url) =>
        fetch(url).then((resp) => resp.json())
      )
    ).then((data) => {
      const [stats, regions, speciesData] = data
      setSpeciesData(speciesData as AllSpeciesData)

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
                // const speciesDataForStats = speciesData[species]
                return [
                  regionGID,
                  {
                    ...regionStats,
                    region,
                    // speciesData: {
                    //   name: speciesDataForStats?.en?.aliases?.[0],
                    // },
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
  return { stats, speciesData, regions }
}

export default useCoreData
