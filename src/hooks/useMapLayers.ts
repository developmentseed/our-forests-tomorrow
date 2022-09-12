import { PickingInfo } from '@deck.gl/core/typed'
import { BitmapLayer } from '@deck.gl/layers/typed'
import { useAtom, useAtomValue } from 'jotai'
import {
  TileLayer,
  TileLayerProps,
  MVTLayer,
  MVTLayerProps,
} from '@deck.gl/geo-layers/typed'
import { BASEMAP_COUNTRIES, BASEMAP_REGIONS } from '../constants_common'
import { useMemo, useState } from 'react'
import { Cell, LayerGenerator, TimeStep } from '../types'
import { getCellTypeAtTimeStep } from '../utils'
import {
  CellTypeEnum,
  COLOR_BY_CELL_TYPE,
  COUNTRIES_WITH_REGIONS_GIDS,
} from '../constants'
import { currentRegionAtom, currentSpeciesAtom, timeStepAtom } from '../atoms'

const isLocal = window.location.hostname === 'localhost'
const baseTilesURL = isLocal
  ? '//localhost:9090'
  : '//storage.googleapis.com/eu-trees4f-tiles/pbf'

const LABELS: LayerGenerator = {
  config: {
    id: 'labels',
    data: 'https://a.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}@2x.png ',
    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,

    renderSubLayers: (props) => {
      const {
        bbox: { west, south, east, north },
      } = props.tile as any

      return new BitmapLayer(props, {
        data: null,
        image: props.data,
        bounds: [west, south, east, north],
      }) as any
    },
  } as TileLayerProps,
}

const BASE_TILED_LAYER_CONFIG = {
  minZoom: 0,
  maxZoom: 8,
  // noop on tile errors
  onTileError: (err: any) => {},
}

const BASE_REGIONS_CONFIG = {
  ...BASE_TILED_LAYER_CONFIG,
  getLineColor: [192, 192, 192],
  pickable: true,
}

const COUNTRIES: LayerGenerator = {
  config: {
    ...BASE_REGIONS_CONFIG,
    id: 'countries',
    data: `${baseTilesURL}/${BASEMAP_COUNTRIES}/{z}/{x}/{y}.pbf`,
    getFillColor: [0, 30, 0],
  } as MVTLayerProps,
  overrides: {
    getLineWidth: [1000, 2000],
  },
}

const REGIONS: LayerGenerator = {
  config: {
    ...BASE_REGIONS_CONFIG,
    id: 'regions',
    data: `${baseTilesURL}/${BASEMAP_REGIONS}/{z}/{x}/{y}.pbf`,
    getFillColor: [0, 0, 0, 0],
  } as MVTLayerProps,
  overrides: {
    getLineWidth: [500, 2000],
  },
}

const GRID: LayerGenerator = {
  config: {
    ...BASE_TILED_LAYER_CONFIG,
    id: 'grid',
    pickable: true,
    binary: false,
    pointType: 'circle',
  } as MVTLayerProps,
  overrides: {
    data: (species: string) =>
      `${baseTilesURL}/species/${species}/{z}/{x}/{y}.pbf`,
    getPointRadiusByZoom: (zoom: number) => {
      if (zoom <= 1) {
        return 20000
      } else if (zoom >= 2 && zoom <= 3) {
        return 10000
      } else if (zoom >= 4 && zoom <= 5) {
        return 5000
      } else if (zoom >= 6) {
        return 2500
      }
    },
    getFillColor: (
      d: Cell,
      timeStep: TimeStep,
      speciesColor: number[],
      region?: string
    ) => {
      const type = getCellTypeAtTimeStep(d, timeStep)
      if (!type) {
        // console.log(d, timeStep)
        return [0, 0, 0, 0]
      }
      const baseColor = COLOR_BY_CELL_TYPE[type]
      // type === CellTypeEnum.Stable
      //   ? speciesColor
      //   : COLOR_BY_CELL_TYPE[getCellTypeAtTimeStep(d, timeStep)]
      if (!region) return baseColor
      // TODO filter by region
      const alpha = false ? 255 : 50
      return [...baseColor, alpha]
    },
  },
}

type UseMapLayerProps = {
  mainColor: number[]
  onGridLoaded: (grid: any) => void
}

function useMapLayers({ mainColor, onGridLoaded }: UseMapLayerProps) {
  const [tilesZoom, setTilesZoom] = useState(3)
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null)
  const currentSpecies = useAtomValue(currentSpeciesAtom)
  const timeStep = useAtomValue(timeStepAtom)
  const [currentRegion, setCurrentRegion] = useAtom(currentRegionAtom)

  return useMemo(() => {
    const labels = new TileLayer(LABELS.config)

    const countries = new MVTLayer({
      ...COUNTRIES.config,
      getLineWidth: (d: any) => {
        return d.properties?.GID_0 === hoveredRegionId
          ? COUNTRIES.overrides.getLineWidth[1]
          : COUNTRIES.overrides.getLineWidth[0]
      },
      onClick: (o: PickingInfo) => {
        if (!COUNTRIES_WITH_REGIONS_GIDS.includes(o.object.properties.GID_0)) {
          setCurrentRegion(o.object.properties.GID_0)
        }
      },
      onHover: (o: PickingInfo) => {
        if (o.object?.properties.fid) {
          setHoveredRegionId(o.object?.properties.fid)
        }
      },
      updateTriggers: {
        getLineWidth: hoveredRegionId,
      },
    } as Omit<MVTLayerProps, 'TilesetClass'>)

    const regions = new MVTLayer({
      ...REGIONS.config,
      getLineWidth: (d: any) => {
        return d.properties?.GID_1 === hoveredRegionId
          ? REGIONS.overrides.getLineWidth[1]
          : REGIONS.overrides.getLineWidth[0]
      },
      onClick: (o: PickingInfo) => {
        setCurrentRegion(o.object.properties.GID_1)
      },
      onHover: (o: PickingInfo) => {
        if (o.object?.properties.fid) {
          setHoveredRegionId(o.object?.properties.fid)
        }
      },
      updateTriggers: {
        getLineWidth: hoveredRegionId,
      },
    } as Omit<MVTLayerProps, 'TilesetClass'>)

    const grid = new MVTLayer({
      ...GRID.config,
      data: GRID.overrides.data(currentSpecies),
      getPointRadius: GRID.overrides.getPointRadiusByZoom(tilesZoom),
      getFillColor: (d) =>
        GRID.overrides.getFillColor(d, timeStep, mainColor, currentRegion),
      updateTriggers: {
        getPointRadius: tilesZoom,
        getFillColor: [timeStep, mainColor, currentRegion],
      },
      onViewportLoad: (tiles) => {
        if (tiles && tiles[0] && tiles[0].zoom !== tilesZoom) {
          setTilesZoom(tiles[0].zoom)
        }
        if (onGridLoaded) {
          onGridLoaded(grid)
        }
      },
    } as Omit<MVTLayerProps, 'TilesetClass'>)

    return {
      layers: [countries, regions, grid, labels],
      countries,
      regions,
      grid,
    }
  }, [
    currentSpecies,
    mainColor,
    timeStep,
    tilesZoom,
    currentRegion,
    setCurrentRegion,
    hoveredRegionId,
    setHoveredRegionId,
    onGridLoaded,
  ])
}

export default useMapLayers
