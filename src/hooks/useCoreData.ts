import { t } from 'i18next'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AllSpeciesData,
  Region,
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
          // console.log(
          //   i18n.t(`species.${speciesKey}`, { lng: 'fr' }),
          //   i18n.t(`species.${speciesKey}`, { lng: 'en' })
          // )
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

      // Compute overall stats
      const getEmptyValuesByYear = () =>
        ({
          '2005': 0,
          '2035': [0, 0, 0],
          '2065': [0, 0, 0],
          '2095': [0, 0, 0],
        } as ValuesByYear)

      const speciesCount: ValuesByRegionGID = {}
      const statsWithGlobalStatsForSpecies = Object.fromEntries(
        Object.entries(statsWithRegions).map(
          ([species, speciesStats]: [string, ValuesByRegionGID]) => {
            // summary for this species
            const global = getEmptyValuesByYear()
            Object.values(speciesStats)
              .filter((regStats) => !regStats.region?.GID_1)
              .forEach((regStats) => {
                global['2005'] += regStats['2005']
                regStats['2035'].forEach(
                  (v, i) => ((global['2035'] as any)[i] += v || 0)
                )
                regStats['2065'].forEach(
                  (v, i) => ((global['2065'] as any)[i] += v || 0)
                )
                regStats['2095'].forEach(
                  (v, i) => ((global['2095'] as any)[i] += v || 0)
                )
              })

            // summary for regions
            Object.entries(speciesStats).forEach(([GID, regStats]) => {
              if (!speciesCount[GID]) {
                speciesCount[GID] = getEmptyValuesByYear()
              }
              speciesCount[GID]['2005'] += regStats['2005'] > 0 ? 1 : 0
              regStats['2035'].forEach((v, i) => {
                ;(speciesCount[GID]['2035'] as any)[i] +=
                  (regStats['2035'][i] as any) > 0 ? 1 : 0
              })
              regStats['2065'].forEach((v, i) => {
                ;(speciesCount[GID]['2065'] as any)[i] +=
                  (regStats['2065'][i] as any) > 0 ? 1 : 0
              })
              regStats['2095'].forEach((v, i) => {
                ;(speciesCount[GID]['2095'] as any)[i] +=
                  (regStats['2095'][i] as any) > 0 ? 1 : 0
              })
            })

            return [
              species,
              {
                global,
                ...speciesStats,
              },
            ]
          }
        )
      )
      const statsWithSpeciesCountForRegions = {
        ...statsWithGlobalStatsForSpecies,
        speciesCount,
      }

      console.log('????', statsWithSpeciesCountForRegions)
      setStats(statsWithSpeciesCountForRegions as StatsBySpecies)
      setRegions(regionsWithLabels)
    })
  }, [stats, i18n])
  return { stats, speciesData, regions }
}

export default useCoreData
