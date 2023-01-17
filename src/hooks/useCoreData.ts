import { Feature, FeatureCollection } from 'geojson'
import { t } from 'i18next'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES } from '../constants'
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
  const [regionsGeoJson, setRegionsGeoJson] = useState<FeatureCollection>()
  const [countriesGeoJson, setCountriesGeoJson] = useState<FeatureCollection>()
  const { i18n } = useTranslation()
  useEffect(() => {
    if (stats) return
    Promise.all(
      [
        './stats.json',
        './regions.json',
        './species_data.json',
        './regions.geojson',
        './countries.geojson',
      ].map((url) => fetch(url).then((resp) => resp.json()))
    ).then((data) => {
      const [stats, regions, allSpeciesData, regionsGeoJson, countriesGeoJson] =
        data

      const allSpeciesDataWithLabels: AllSpeciesData = Object.fromEntries(
        Object.entries(allSpeciesData).map(([speciesKey, speciesData]) => {
          const data = {
            ...(speciesData as any),
            latin: formatLatin(speciesKey),
          }
          data.labels = Object.fromEntries(
            SUPPORTED_LANGUAGES.map((lang) => {
              const speciesLangData = (speciesData as any).labels[lang] || {}
              const langData = {
                ...speciesLangData,
                // TODO we shouldn't use that anymore, fails on lng switching
                name: i18n.t(`species.${speciesKey}`, { lng: lang }),
              }
              return [lang, langData]
            })
          )
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
                    species,
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

      setStats(statsWithSpeciesCountForRegions as StatsBySpecies)
      setRegions(regionsWithLabels)
      setRegionsGeoJson({
        ...regionsGeoJson,
        features: regionsGeoJson.features.filter((g: Feature) => g.geometry),
      })
      setCountriesGeoJson({
        ...countriesGeoJson,
        features: countriesGeoJson.features.filter((g: Feature) => g.geometry),
      })
    })
  }, [stats, i18n])
  return { stats, speciesData, regions, regionsGeoJson, countriesGeoJson }
}

export default useCoreData
