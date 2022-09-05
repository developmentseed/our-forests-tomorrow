import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'
import { timeStepAtom } from '../atoms'
import { THEME } from '../constants'
import { deckColorToCss } from '../utils'
import { LegendItem, MapLegendsWrapper } from './MapLegend.styled'

export type MapLegendProps = {
  mainColor: number[]
}

function MapLegend({ mainColor }: MapLegendProps) {
  const { t } = useTranslation()
  const timeStep = useAtomValue(timeStepAtom)
  return (
    <MapLegendsWrapper>
      <LegendItem
        color={timeStep === '2005' ? undefined : deckColorToCss(mainColor)}
      >
        {timeStep === '2005'
          ? t('general.suitability')
          : t('mapLegend.suitability', undefined, { year: timeStep })}
      </LegendItem>

      <LegendItem color={deckColorToCss(mainColor)}>
        {timeStep === '2005'
          ? t('general.currentDistribution')
          : t('mapLegend.stable', undefined, { year: timeStep })}
      </LegendItem>

      <LegendItem
        color={timeStep === '2005' ? undefined : THEME.colors.decolonized}
      >
        {timeStep === '2005'
          ? t('general.decolonization')
          : t('mapLegend.decolonization', undefined, { year: timeStep })}
      </LegendItem>
    </MapLegendsWrapper>
  )
}

export default MapLegend
