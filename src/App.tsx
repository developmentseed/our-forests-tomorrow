import React, { useState, Fragment, useCallback } from 'react'
import { Feature } from 'geojson'
import './App.css'
import SpeciesChoice from './SpeciesChoice'
import Map from './map/Map'
import MapControls from './map/MapControls'
import { RegionFeature, TimeStep } from './types'
import MapTimeseries from './map/MapTimeseries'
import { SPECIES_WHITELIST } from './constants_common'
import RegionStats from './pages/RegionPage'
import SpeciesStats from './pages/SpeciesPage'
import useCoreData from './hooks/useCoreData'
import Nav from './nav/Nav'

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
      <Nav />
      {region ? (
        <RegionStats
          stats={stats}
          region={region}
          species={species}
          onRegionClose={closeRegion}
        />
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
