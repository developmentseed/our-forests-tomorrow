#!/usr/bin/env node
import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { GD_DATA, SIMPLIFIED_REGIONS } from '../src/constants_common.js'

const regions = JSON.parse(readFileSync(SIMPLIFIED_REGIONS, 'utf-8'))

const gdData = {}

for (let i = 0; i < regions.features.length; i++) {
  const feature = regions.features[i]
  const curl = `curl 'https://www.globalforestwatch.org/api/gfw/geodescriber/geom/?template=true&app=gfw' \
  -H 'Accept: application/json, text/plain, */*' \
  -H 'Accept-Language: en-GB,en;q=0.7' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  -H 'Origin: https://www.globalforestwatch.org' \
  -H 'Referer: https://www.globalforestwatch.org/map/geostore/fb86c003d1d799c9237325bec9af2089/?analysis=eyJzaG93RHJhdyI6dHJ1ZX0%3D&mainMap=eyJzaG93QW5hbHlzaXMiOnRydWV9&map=eyJjZW50ZXIiOnsibGF0Ijo0Ny44NTUxOTc3Mzk5NDgyNzQsImxuZyI6NS45ODg3MjgwMjM1NzEwMDY1fSwiem9vbSI6Ny43OTM2NjQ3ODIzNTQxNjI1fQ%3D%3D' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'Sec-GPC: 1' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36' \
  --data-raw '{"geojson":{"crs":{},"type":"FeatureCollection","features":[${JSON.stringify(
    feature
  )}]}}' \
  --compressed`
  // console.log(curl)
  let key = feature.properties.GID_0
  if (feature.properties.GID_1) {
    key = [key, feature.properties.GID_1].join('_')
  }

  try {
    const r = execSync(curl)
    gdData[key] = {
      properties: { ...feature.properties },
      gd: JSON.parse(r.toString()),
    }

    console.log(key)

  } catch (e) {
    console.log('err', key, e)
  }
}

console.log(gdData)
writeFileSync(GD_DATA, JSON.stringify(gdData))
