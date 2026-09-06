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
import { CONIFERS } from '../constants_common'

const PROTOMAPS_URL = 'pmtiles:///maps/europe.pmtiles'

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
  const stable = [
    'all',
    ['==', ['get', 'nat_1'], 1],
    ['>', ['get', `sdms_rcp${rcp}_fut${fut}_1`], 500],
  ]

  const decolonized = [
    'all',
    ['==', ['get', 'nat_1'], 1],
    ['<', ['get', `sdms_rcp${rcp}_fut${fut}_1`], 500],
  ]

  const suitable = [
    'all',
    ['==', ['get', 'nat_1'], 0],
    ['>', ['get', `sdms_rcp${rcp}_fut${fut}_1`], 500],
  ]

  const filter =
    fut === 0
      ? ['==', ['get', 'nat_1'], 1]
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
          '#ff0fff',
        ]

  const basemapLayers = protomapsLayers(
    'protomaps',
    namedFlavor('white'),
    {
      lang: 'en',
    }
  )

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

      hex10: {
        type: 'vector' as const,
        tiles: [
          `https://storage.googleapis.com/eu-trees4f-tiles/hex/tiles/${species}/10/{z}/{x}/{y}.pbf`,
        ],
      },

      hex20: {
        type: 'vector' as const,
        tiles: [
          `https://storage.googleapis.com/eu-trees4f-tiles/hex/tiles/${species}/20/{z}/{x}/{y}.pbf`,
        ],
      },
    },

    layers: [
      ...basemapLayers,

      {
        id: 'hex10',
        type: 'fill' as const,
        source: 'hex10',
        'source-layer': `${species}_10_hex`,
        filter,
        paint: {
          'fill-color': fillColor,
        },
      },

      {
        id: 'hex20',
        type: 'fill' as const,
        source: 'hex20',
        'source-layer': `${species}_20_hex`,
        filter,
        paint: {
          'fill-color': fillColor,
        },
      },
    ],
  }

  return style
}

export default useMapStyle
