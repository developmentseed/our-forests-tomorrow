import { useAtomValue } from 'jotai'
import { useMemo } from 'react'

import {
  layers as protomapsLayers,
  namedFlavor,
} from '@protomaps/basemaps'

import {
  currentRCPAtom,
  currentSpeciesAtom,
  timeStepAtom,
} from '../atoms'

import { THEME, TIME_STEPS } from '../constants'

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? `${window.location.origin}${process.env.PUBLIC_URL}`
    : window.location.origin

const PROTOMAPS_URL =
  `pmtiles://${BASE_URL}/maps/europe.pmtiles`

function useMapStyle() {
  const species = useAtomValue(currentSpeciesAtom)
  const timeStep = useAtomValue(timeStepAtom)
  const rcp = useAtomValue(currentRCPAtom)

  return useMemo(() => {
    const fut = TIME_STEPS.indexOf(timeStep)

    return getMapStyle({
      rcp,
      fut,
      species,
    })
  }, [species, timeStep, rcp])
}

function getMapStyle({
  rcp,
  fut,
  species,
}: {
  rcp: string
  fut: number
  species: string
}) {
  const basemapLayers = protomapsLayers(
    'protomaps',
    namedFlavor('white'),
    {
      lang: 'en',
    }
  )

  const current = ['get', 'current']
  const future_var_name =
    fut === 0
      ? 'current'
      : fut === 1
        ? 'fut1'
        : fut === 2
          ? 'fut2'
          : 'fut3'
  const future = ['get', future_var_name]

  const stable = [
    'all',
    ['>=', current, 500],
    ['>=', future, 500],
  ]
  const decolonized = [
    'all',
    ['>=', current, 500],
    ['<', future, 500],
  ]
  const suitable = [
    'all',
    ['<', current, 500],
    ['>=', future, 500],
  ]

  const filter =
    fut === 0
      ? ['>=', current, 500]
      : ['any', stable, decolonized, suitable]

  const fillColor =
    fut === 0
      ? THEME.colors.stable
      : [
          'case',
          stable,
          THEME.colors.stable,
          decolonized,
          THEME.colors.decolonized,
          suitable,
          THEME.colors.suitable,
          THEME.colors.stable,
        ]

  const style = {
    version: 8 as const,

    glyphs:
      'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',

    sprite:
      'https://protomaps.github.io/basemaps-assets/sprites/v4/white',

    sources: {
      protomaps: {
        type: 'vector' as const,
        url: PROTOMAPS_URL,
        attribution:
          '© <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
      },

      trees: {
        type: 'vector' as const,
        tiles: [
          `${BASE_URL}/pbf/rcp${rcp}/${species}/{z}/{x}/{y}.pbf`
        ],
        minzoom: 2,
        maxzoom: 8,
      },
    },

    layers: [
      ...basemapLayers,

      {
        id: 'trees',
        type: 'fill' as const,
        source: 'trees',
        'source-layer': species,
        filter,
        paint: {
          'fill-color': fillColor,
          'fill-opacity': 0.85,
        },
      },
    ],
  }

  return style
}

export default useMapStyle
