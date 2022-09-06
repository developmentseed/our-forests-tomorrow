import { t } from 'i18next'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AllSpeciesData,
  Region,
  SpeciesData,
  StatsBySpecies,
  ValuesByRegionGID,
  ValuesByYear,
} from '../types'
import { formatLatin } from '../utils'

function useCoreData() {
  const [stats, setStats] = useState<StatsBySpecies | null>(null)
  const [speciesData, setSpeciesData] = useState<AllSpeciesData | null>(null)
  const [regions, setRegions] = useState<Region[]>([])
  const { i18n } = useTranslation()
  useEffect(() => {
    if (stats) return
    Promise.all(
      ['./stats.json', './regions.json', './species_data.json'].map((url) =>
        fetch(url).then((resp) => resp.json())
      )
    ).then((data) => {
      const [stats, regions, allSpeciesData] = data

      const allSpeciesDataWithLabels: AllSpeciesData = Object.fromEntries(
        Object.entries(allSpeciesData).map(([speciesKey, speciesData]) => {
          const data = {
            ...(speciesData as any),
            latin: formatLatin(speciesKey),
            labels: {
              fr: {
                ...(speciesData as any).labels.fr,
                name: i18n.t(`species.${speciesKey}`, { lng: 'fr' }),
              },
              en: {
                ...(speciesData as any).labels.en,
                name: i18n.t(`species.${speciesKey}`, { lng: 'en' }),
              },
            },
          }
          return [speciesKey, data]
        })
      )
      console.log(allSpeciesDataWithLabels)
      setSpeciesData(allSpeciesDataWithLabels)

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
