import React, {
  useState,
  Fragment,
  useCallback,
  useEffect,
} from 'react'
import { Feature } from 'geojson'

import MapControls from './map/MapControls'
import RegionPage from './pages/RegionPage'
import SpeciesPage from './pages/SpeciesPage'
import useCoreData from './hooks/useCoreData'
import Nav from './nav/Nav'
import {
  currentRegionAtom,
  currentSpeciesAtom,
  introCompletedAtom,
} from './atoms'
import { useAtom, useAtomValue } from 'jotai'
import useTimeseriesData from './hooks/useTimeseriesData'
import Intro from './intro/Intro'
import SVGHatchPattern from './components/SVGHatchPattern'
import { deckColorToCss } from './utils'
import { CellTypeEnum, COLOR_BY_CELL_TYPE } from './constants'
import MapboxGLMap from './map/MapboxGLMap'

function App() {
  const currentSpecies = useAtomValue(currentSpeciesAtom)
  const [currentRegion, setCurrentRegion] = useAtom(currentRegionAtom)
  const [renderedFeatures, setRenderedFeatures] = useState<
    undefined | Feature[]
  >(undefined)
  const introCompleted = useAtomValue(introCompletedAtom)

  // TODO move to reg page
  const closeRegion = useCallback(() => {
    setCurrentRegion(null)
  }, [setCurrentRegion])

  const { stats, speciesData, regions, regionsGeoJson, countriesGeoJson } =
    useCoreData()

  useEffect(() => {
    if (introCompleted) {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [introCompleted])

  const currentSpeciesData = speciesData?.[currentSpecies]
  const timeseriesData = useTimeseriesData(renderedFeatures)

  return !stats ||
    !speciesData ||
    !currentSpeciesData ||
    !regions ||
    !regionsGeoJson ||
    !countriesGeoJson ? (
    <div>loading</div>
  ) : (
    <Fragment>
      <Nav species={speciesData} regions={regions} stats={stats} />

      {!introCompleted && <Intro species={speciesData} />}
      <MapboxGLMap
        mainColor={currentSpeciesData.color}
        onRenderedFeaturesChange={setRenderedFeatures}
        regionsGeoJson={regionsGeoJson}
        countriesGeoJson={countriesGeoJson}
      >
        <MapControls
          timeseriesData={timeseriesData}
          mainColor={currentSpeciesData.color}
        />
      </MapboxGLMap>
      {introCompleted && (
        <Fragment>
          {currentRegion ? (
            <RegionPage onRegionClose={closeRegion} />
          ) : (
            <SpeciesPage
              stats={stats}
              currentSpeciesData={currentSpeciesData}
            />
          )}
        </Fragment>
      )}
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="13"
        // viewBox="0 0 726 628"
      >
        <defs>
          <SVGHatchPattern
            color={deckColorToCss(COLOR_BY_CELL_TYPE[CellTypeEnum.Stable])}
            hatchWidth={1.5}
          />
          <linearGradient id="gradStableToDecolonized">
            <stop
              offset="0%"
              stopColor={deckColorToCss(
                COLOR_BY_CELL_TYPE[CellTypeEnum.Stable]
              )}
            />
            <stop
              offset="100%"
              stopColor={deckColorToCss(
                COLOR_BY_CELL_TYPE[CellTypeEnum.Decolonized]
              )}
            />
          </linearGradient>
        </defs>
      </svg>
    </Fragment>
  )
}

export default App
