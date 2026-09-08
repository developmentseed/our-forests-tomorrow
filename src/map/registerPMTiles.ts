import { Protocol } from 'pmtiles'
import maplibregl from 'maplibre-gl'

const protocol = new Protocol()

maplibregl.addProtocol('pmtiles', protocol.tile)
