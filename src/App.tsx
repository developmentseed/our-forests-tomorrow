import React, { useState, Fragment, useCallback } from 'react'
import { Feature } from 'geojson'

import Map from './map/Map'
import MapControls from './map/MapControls'
import { RegionFeature } from './types'
import MapTimeseries from './map/MapTimeseries'
import RegionPage from './pages/RegionPage'
import SpeciesPage from './pages/SpeciesPage'
import useCoreData from './hooks/useCoreData'
import Nav from './nav/Nav'
import { currentSpeciesAtom } from './atoms'
import { useAtomValue } from 'jotai'

function App() {
  const currentSpecies = useAtomValue(currentSpeciesAtom)
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
      <Nav species={speciesData} />
      <Map
        mainColor={currentSpeciesData.color}
        region={region}
        onRegionChange={setRegion}
        onRenderedFeaturesChange={setRenderedFeatures}
      />
      {region ? (
        <RegionPage stats={stats} region={region} onRegionClose={closeRegion} />
      ) : (
        <SpeciesPage stats={stats} currentSpeciesData={currentSpeciesData} />
      )}

      <MapControls>
        <MapTimeseries
          features={renderedFeatures}
          mainColor={currentSpeciesData.color}
        />
      </MapControls>
    </Fragment>
  )
}

export default App
