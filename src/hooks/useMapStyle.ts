import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { currentRCPAtom, currentSpeciesAtom, timeStepAtom } from '../atoms'
import { THEME, TIME_STEPS } from '../constants'
import basemap from './style.json'
import { CONIFERS } from '../constants_common'

function useMapStyle() {
  const species = useAtomValue(currentSpeciesAtom)
  const timeStep = useAtomValue(timeStepAtom)
  const rcp = useAtomValue(currentRCPAtom)

  return useMemo(() => {
    const fut = TIME_STEPS.indexOf(timeStep)
    return getMapStyle({ rcp, fut, species })
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

  const type = CONIFERS.includes(species) ? 'conifer' : 'deciduous'

  const icon =
    fut === 0
      ? `${type}_stable`
      : [
          'case',
          stable,
          `${type}_stable`,
          decolonized,
          `${type}_decolonized`,
          suitable,
          'seedling',
          'seedling',
        ]

  const style = {
    ...basemap,
    sources: {
      ...basemap.sources,
      hex10: {
        type: 'vector',
        tiles: [
          `https://storage.googleapis.com/eu-trees4f-tiles/hex/tiles/${species}/10/{z}/{x}/{y}.pbf`,
        ],
      },
      hex20: {
        type: 'vector',
        tiles: [
          `https://storage.googleapis.com/eu-trees4f-tiles/hex/tiles/${species}/20/{z}/{x}/{y}.pbf`,
        ],
      },
    },
    layers: [
      ...basemap.layers,
      {
        id: 'hex10',
        type: 'fill',
        source: 'hex10',
        'source-layer': `${species}_10_hex`,
        filter,
        paint: {
          'fill-color': fillColor,
        },
      },
      {
        id: 'hex10_trees',
        type: 'symbol',
        source: 'hex10',
        'source-layer': `${species}_10_hex`,
        layout: {
          'icon-image': icon,
        },
        filter: [
          'all',
          filter,
          [
            '==',
            ['%', ['get', 'id'], ['match', ['zoom'], 5, 15, 1]],
            0,
          ],
        ],
        paint: { 'icon-opacity': 0.5 },
      },
      {
        id: 'hex20',
        type: 'fill',
        source: 'hex20',
        'source-layer': `${species}_20_hex`,
        filter,
        paint: {
          'fill-color': fillColor,
        },
      },
      {
        id: 'hex20_trees',
        type: 'symbol',
        source: 'hex20',
        'source-layer': `${species}_20_hex`,
        layout: {
          'icon-image': icon,
          // 'icon-allow-overlap': true,
        },
        // filter,
        filter: [
          'all',
          filter,
          [
            '==',
            ['%', ['get', 'id'], ['match', ['zoom'], 2, 120, 3, 70, 30]],
            0,
          ],
        ],
        paint: { 'icon-opacity': 0.5 },
      },
    ],
  }

  return style
}

export default useMapStyle
