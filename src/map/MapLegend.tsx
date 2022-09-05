import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'
import { timeStepAtom } from '../atoms'
import { MapLegendsWrapper } from './MapLegend.styled'

export type MapLegendProps = {
  mainColor: number[]
}

function MapLegend({ mainColor }: MapLegendProps) {
  const { t } = useTranslation()
  const timeStep = useAtomValue(timeStepAtom)
  return (
    <MapLegendsWrapper timeStep={timeStep}>
      <li>
        {timeStep === '2005'
          ? t('general.currentDistribution')
          : t('mapLegend.stable', undefined, { timeStep })}
      </li>
      <li>
        {timeStep === '2005'
          ? t('general.decolonization')
          : t('mapLegend.decolonization', undefined, { timeStep })}
      </li>
      <li>
        {timeStep === '2005'
          ? t('general.suitability')
          : t('mapLegend.suitability', undefined, { timeStep })}
      </li>
    </MapLegendsWrapper>
  )
}

export default MapLegend
