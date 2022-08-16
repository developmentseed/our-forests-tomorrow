import React, { useState, Fragment, useCallback, useEffect } from 'react'
import './App.css'
import SpeciesChoice from './SpeciesChoice'
import Map from './Map'
import MapControls from './MapControls'
import {
  Region,
  RegionFeature,
  StatsBySpecies,
  TimeStep,
  ValuesByRegionGID,
  ValuesByYear,
} from './types'
import { Feature } from 'geojson'
import Timeseries from './Timeseries'
import { SPECIES_WHITELIST } from './constants_common'
import RegionStats from './RegionStats'
import SpeciesStats from './SpeciesStats'

function App() {
  const [timeStep, setTimeStep] = useState<TimeStep>('2005')
  const [species, setSpecies] = useState<string>(
    SPECIES_WHITELIST[Math.floor(SPECIES_WHITELIST.length * Math.random())]
  )
  const [region, setRegion] = useState<RegionFeature | null>(null)
  const [renderedFeatures, setRenderedFeatures] = useState<
    undefined | Feature[]
  >(undefined)

  const closeRegion = useCallback(() => {
    setRegion(null)
  }, [setRegion])

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

      const regionsWithLabels = (regions as Region[]).map((r) => {
        return {
          ...r,
          label: r.GID_1 ? `${r.NAME_1} (${r.COUNTRY})` : r.COUNTRY,
        }
      })
      console.log(regionsWithLabels)

      // attach regions to stats
      const statsWithRegions = Object.fromEntries(
        Object.entries(stats as StatsBySpecies).map(
          ([species, speciesStats]: [string, ValuesByRegionGID]) => {
            const regionEntries = Object.entries(speciesStats).map(
              ([regionGID, regionStats]: [string, ValuesByYear]) => {
                const region = regionsWithLabels.find(
                  (r: Region) =>
                    r.GID_1 === regionGID || (!r.GID_1 && r.GID_0 === regionGID)
                )
                return [
                  regionGID,
                  {
                    ...regionStats,
                    region,
                  } as ValuesByYear,
                ]
              }
            )
            return [species, Object.fromEntries(regionEntries)]
          }
        )
      )
      console.log(statsWithRegions)
      setStats(statsWithRegions as StatsBySpecies)
      setRegions(regionsWithLabels)
    })
  }, [stats])

  return !stats ? (
    <div>loading</div>
  ) : (
    <Fragment>
      {region ? (
        <RegionStats stats={stats} region={region} species={species} />
      ) : (
        <SpeciesStats
          stats={stats}
          species={species}
          speciesDetail={speciesDetail}
        />
      )}
      <Map
        timeStep={timeStep}
        species={species}
        region={region}
        onRegionChange={setRegion}
        onRenderedFeaturesChange={setRenderedFeatures}
      />
      <MapControls>
        <Timeseries
          timeStep={timeStep}
          onTimestepChange={setTimeStep}
          features={renderedFeatures}
          species={species}
        />
      </MapControls>
      <SpeciesChoice
        species={species}
        region={region}
        onSpeciesChange={setSpecies}
        onRegionClose={closeRegion}
      />
    </Fragment>
  )
}

export default App
