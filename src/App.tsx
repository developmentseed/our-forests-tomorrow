import React, { Fragment, useCallback, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
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
import Intro from './intro/Intro'
import SVGHatchPattern from './components/SVGHatchPattern'
import {
  CellTypeEnum,
  COLOR_BY_CELL_TYPE,
  GLOBAL_REGION_GID,
  THEME,
} from './constants'
import MapboxGLMap from './map/MapboxGLMap'
import MapTopControls from './map/MapTopControls'

function App() {
  const currentSpecies = useAtomValue(currentSpeciesAtom)
  const [currentRegion, setCurrentRegion] = useAtom(currentRegionAtom)
  const introCompleted = useAtomValue(introCompletedAtom)

  // TODO move to reg page
  const closeRegion = useCallback(() => {
    setCurrentRegion(GLOBAL_REGION_GID)
  }, [setCurrentRegion])

  const { stats, speciesData, regions, regionsGeoJson, countriesGeoJson } =
    useCoreData()

  useEffect(() => {
    if (introCompleted) {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [introCompleted])

  const isMobile = useMediaQuery({
    query: `(max-width: ${THEME.breakpoints.mobile})`,
  })

  const currentSpeciesData = speciesData?.[currentSpecies]

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
      <div id="menuPortal" style={{ position: 'relative' }}></div>

      {!introCompleted && <Intro species={speciesData} />}
      <MapboxGLMap
        regionsGeoJson={regionsGeoJson}
        countriesGeoJson={countriesGeoJson}
      >
        <MapTopControls />
        {isMobile && <MapControls />}
      </MapboxGLMap>
      {introCompleted && (
        <Fragment>
          {currentRegion !== GLOBAL_REGION_GID ? (
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
            color={COLOR_BY_CELL_TYPE[CellTypeEnum.Suitable]}
            hatchWidth={1.5}
          />
          <linearGradient id="gradStableToDecolonized">
            <stop
              offset="0%"
              stopColor={COLOR_BY_CELL_TYPE[CellTypeEnum.Stable]}
            />
            <stop
              offset="100%"
              stopColor={COLOR_BY_CELL_TYPE[CellTypeEnum.Decolonized]}
            />
          </linearGradient>
        </defs>
      </svg>
    </Fragment>
  )
}

export default App
