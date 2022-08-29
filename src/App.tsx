import React, { useState, Fragment, useCallback } from 'react'
import './App.css'
import SpeciesChoice from './SpeciesChoice'
import Map from './Map'
import MapControls from './MapControls'
import { RegionFeature, TimeStep } from './types'
import { Feature } from 'geojson'
import MapTimeseries from './MapTimeseries'
import { SPECIES_WHITELIST } from './constants_common'
import RegionStats from './RegionPage'
import SpeciesStats from './SpeciesPage'
import useCoreData from './hooks/useCoreData'

function App() {
  const [timeStep, setTimeStep] = useState<TimeStep>('2005')
  const [species, setSpecies] = useState<string>(
    SPECIES_WHITELIST[Math.floor(SPECIES_WHITELIST.length * Math.random())]
  )
  const [region, setRegion] = useState<RegionFeature | null>(null)
  const [renderedFeatures, setRenderedFeatures] = useState<
    undefined | Feature[]
  >(undefined)

  // TODO move to reg page
  const closeRegion = useCallback(() => {
    setRegion(null)
  }, [setRegion])

  const { stats, speciesDetail, regions } = useCoreData()

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
        <MapTimeseries
          timeStep={timeStep}
          onTimestepChange={setTimeStep}
          features={renderedFeatures}
          species={species}
        />
      </MapControls>
      <SpeciesChoice species={species} onSpeciesChange={setSpecies} />
    </Fragment>
  )
}

export default App
