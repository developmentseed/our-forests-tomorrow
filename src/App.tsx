import React, { useState, Fragment, useCallback } from 'react'
import { Feature } from 'geojson'
import Map from './map/Map'
import MapControls from './map/MapControls'
import { RegionFeature, TimeStep } from './types'
import MapTimeseries from './map/MapTimeseries'
import { SPECIES_WHITELIST } from './constants_common'
import RegionPage from './pages/RegionPage'
import SpeciesPage from './pages/SpeciesPage'
import useCoreData from './hooks/useCoreData'
import Nav from './nav/Nav'

function App() {
  const [timeStep, setTimeStep] = useState<TimeStep>('2005')
  const [currentSpecies, setCurrentSpecies] = useState<string>(
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

  const { stats, speciesData, regions } = useCoreData()

  const currentSpeciesData = speciesData?.[currentSpecies]

  return !stats || !speciesData || !currentSpeciesData ? (
    <div>loading</div>
  ) : (
    <Fragment>
      <Nav species={speciesData} onSpeciesChange={setCurrentSpecies} />
      <Map
        timeStep={timeStep}
        currentSpecies={currentSpecies}
        mainColor={currentSpeciesData.color}
        region={region}
        onRegionChange={setRegion}
        onRenderedFeaturesChange={setRenderedFeatures}
      />
      {region ? (
        <RegionPage
          stats={stats}
          region={region}
          currentSpecies={currentSpecies}
          onRegionClose={closeRegion}
        />
      ) : (
        <SpeciesPage
          stats={stats}
          currentSpecies={currentSpecies}
          currentSpeciesData={currentSpeciesData}
        />
      )}

      <MapControls>
        <MapTimeseries
          timeStep={timeStep}
          onTimestepChange={setTimeStep}
          features={renderedFeatures}
          mainColor={currentSpeciesData.color}
        />
      </MapControls>
    </Fragment>
  )
}

export default App
