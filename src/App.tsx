import React, { useState, Fragment, useCallback, useEffect } from 'react'
import { Feature } from 'geojson'

import Map from './map/Map'
import MapControls from './map/MapControls'
import { RegionFeature } from './types'
import RegionPage from './pages/RegionPage'
import SpeciesPage from './pages/SpeciesPage'
import useCoreData from './hooks/useCoreData'
import Nav from './nav/Nav'
import { currentSpeciesAtom, introCompletedAtom } from './atoms'
import { useAtomValue } from 'jotai'
import useTimeseriesData from './hooks/useTimeseriesData'
import Intro from './intro/Intro'

function App() {
  const currentSpecies = useAtomValue(currentSpeciesAtom)
  const [region, setRegion] = useState<RegionFeature | null>(null)
  const [renderedFeatures, setRenderedFeatures] = useState<
    undefined | Feature[]
  >(undefined)
  const introCompleted = useAtomValue(introCompletedAtom)

  // TODO move to reg page
  const closeRegion = useCallback(() => {
    setRegion(null)
  }, [setRegion])

  const { stats, speciesData, regions } = useCoreData()

  useEffect(() => {
    if (introCompleted) {
      window.scrollTo({ top: 0 })
    }
  }, [introCompleted])

  const currentSpeciesData = speciesData?.[currentSpecies]

  const timeseriesData = useTimeseriesData(renderedFeatures)

  return !stats || !speciesData || !currentSpeciesData ? (
    <div>loading</div>
  ) : (
    <Fragment>
      <Nav species={speciesData} regions={regions} stats={stats} />

      {!introCompleted && <Intro species={speciesData} />}
      <Map
        mainColor={currentSpeciesData.color}
        region={region}
        onRegionChange={setRegion}
        onRenderedFeaturesChange={setRenderedFeatures}
      >
        <MapControls
          timeseriesData={timeseriesData}
          mainColor={currentSpeciesData.color}
        />
      </Map>
      {introCompleted && (
        <Fragment>
          {region ? (
            <RegionPage
              stats={stats}
              region={region}
              onRegionClose={closeRegion}
            />
          ) : (
            <SpeciesPage
              stats={stats}
              currentSpeciesData={currentSpeciesData}
            />
          )}
        </Fragment>
      )}
    </Fragment>
  )
}

export default App
