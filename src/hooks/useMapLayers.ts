import { PickingInfo, COORDINATE_SYSTEM } from '@deck.gl/core/typed'
import {
  BitmapLayer,
  ScatterplotLayer,
  ColumnLayer,
} from '@deck.gl/layers/typed'
import { ClipExtension } from '@deck.gl/extensions/typed'
import { Matrix4 } from '@math.gl/core'
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
import { COLOR_BY_CELL_TYPE, COUNTRIES_WITH_REGIONS_GIDS } from '../constants'
import { currentRegionAtom, currentSpeciesAtom, timeStepAtom } from '../atoms'
import { Feature } from 'geojson'

const isLocal = window.location.hostname === 'localhost'
const baseTilesURL = isLocal
  ? '//localhost:9090'
  : '//storage.googleapis.com/eu-trees4f-tiles/pbf'

const LABELS: LayerGenerator = {
  config: {
    id: 'labels',
    data: `https://api.mapbox.com/styles/v1/nerik8000/cl8lnhc15002b14pfbqev2wmn/tiles/512/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`,
    minZoom: 0,

    maxZoom: 10,
    tileSize: 512,

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

const HEX_GRID: LayerGenerator = {
  config: {
    ...BASE_TILED_LAYER_CONFIG,
    id: 'hexgrid',
    pickable: true,
    binary: false,
  } as MVTLayerProps,
  overrides: {
    data: (species: string) =>
      `${baseTilesURL}/species/${species}/{z}/{x}/{y}.pbf`,
    getPointRadiusByZoom: (zoom: number) => {
      if (zoom <= 1) {
        return 33600
      } else if (zoom >= 2 && zoom <= 3) {
        return 16800
      } else if (zoom >= 4 && zoom <= 5) {
        return 8400
      } else if (zoom >= 6) {
        return 4200
      }
    },
    getFillColor: (
      d: Cell,
      timeStep: TimeStep,
      speciesColor: number[],
      region?: string
    ) => {
      const baseColor = COLOR_BY_CELL_TYPE[
        getCellTypeAtTimeStep(d, timeStep)
      ] || [0, 0, 0, 0]
      return baseColor
      // type === CellTypeEnum.Stable
      //   ? speciesColor
      //   : COLOR_BY_CELL_TYPE[getCellTypeAtTimeStep(d, timeStep)]
      // TODO filter by region
      // if (!region) return baseColor
      // const alpha = false ? 255 : 50
      // return [...baseColor, alpha]
    },
  },
}

class HexagonCellsLayer extends ColumnLayer {
  getShaders() {
    const shaders = super.getShaders()
    // shaders.inject = {
    //   'fs:DECKGL_FILTER_COLOR': `\
    //     float interval = 16.0;
    //     float x = float(geometry.worldPosition.x);
    //     float y = float(geometry.worldPosition.y);
    //     float a = step(mod(x + y, interval) / (interval - 1.0), 0.5);
    //     color.rgba = vec4(color.rgb * a,1.0);
    //   `,
    // }
    return shaders
  }
}
HexagonCellsLayer.layerName = 'HexagonCellsLayer'

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

    const hexGrid = new MVTLayer({
      ...HEX_GRID.config,
      data: HEX_GRID.overrides.data(currentSpecies),
      updateTriggers: {
        getPointRadius: tilesZoom,
        getFillColor: [timeStep, mainColor, currentRegion],
      },
      onViewportLoad: (tiles: any) => {
        if (tiles && tiles[0] && tiles[0].zoom !== tilesZoom) {
          setTilesZoom(tiles[0].zoom)
        }
        if (onGridLoaded) {
          onGridLoaded(hexGrid)
        }
      },
      renderSubLayers: ((
        props: TileLayer['props'] & {
          id: string
          data: Feature[]
          _offset: number
          // tile: Tile2DHeader<ParsedMvtTile>;
          tile: any
        }
      ) => {
        // const { x, y, z } = props.tile.index
        // const worldScale = Math.pow(2, z)
        // const WORLD_SIZE = 512
        // const xScale = WORLD_SIZE / worldScale
        // const yScale = -xScale

        // const xOffset = (WORLD_SIZE * x) / worldScale
        // const yOffset = WORLD_SIZE * (1 - y / worldScale)

        // const modelMatrix = new Matrix4().scale([xScale, yScale, 1])

        // props.autoHighlight = false

        // // if (!this.context.viewport.resolution) {
        // props.modelMatrix = modelMatrix
        // props.coordinateOrigin = [xOffset, yOffset, 0]
        // props.coordinateSystem = COORDINATE_SYSTEM.CARTESIAN
        // props.extensions = [...(props.extensions || []), new ClipExtension()]
        // // }

        return new HexagonCellsLayer({
          ...props,
          diskResolution: 6,
          radius: HEX_GRID.overrides.getPointRadiusByZoom(tilesZoom),
          // getRadius: () => GRID.overrides.getPointRadiusByZoom(tilesZoom),
          getPosition: (d: any) => {
            // const coords = d.geometry.coordinates
            // const projCoords = [coords[0] * xScale, coords[1] * yScale]
            // console.log(coords, projCoords)
            return d.geometry.coordinates
          },
          updateTriggers: {
            getPointRadius: tilesZoom,
            getFillColor: [timeStep, mainColor, currentRegion],
          },
          getFillColor: (d) =>
            HEX_GRID.overrides.getFillColor(
              d,
              timeStep,
              mainColor,
              currentRegion
            ),
        })
      }) as any,
    } as any)

    return {
      layers: [hexGrid, countries, regions, labels],
      countries,
      regions,
      hexGrid,
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
