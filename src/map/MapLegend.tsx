import { useAtomValue } from 'jotai'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { introCompletedAtom, introStepAtom, timeStepAtom } from '../atoms'
import Hexagon from '../components/Hexagon'
import { CellTypeEnum } from '../constants'
import { IntroStepEnum } from '../intro/Intro'
import { LegendItem, MapLegendsWrapper } from './MapLegend.styled'

export type MapLegendProps = {
  mainColor: number[]
}

function MapLegend({ mainColor }: MapLegendProps) {
  const { t } = useTranslation()
  const timeStep = useAtomValue(timeStepAtom)
  const introStep = useAtomValue(introStepAtom)
  const introCompleted = useAtomValue(introCompletedAtom)
  return (
    <MapLegendsWrapper
      visible={introCompleted || introStep >= IntroStepEnum.SpeciesExamplePage}
    >
      <LegendItem disabled={timeStep === '2005'}>
        <Fragment>
          <Hexagon type={CellTypeEnum.Suitable} />
          {timeStep === '2005'
            ? t('general.suitability')
            : t('mapLegend.suitability', undefined, { year: timeStep })}
        </Fragment>
      </LegendItem>

      <LegendItem>
        <Fragment>
          <Hexagon type={CellTypeEnum.Stable} />
          {timeStep === '2005'
            ? t('general.currentDistribution')
            : t('mapLegend.stable', undefined, { year: timeStep })}
        </Fragment>
      </LegendItem>

      <LegendItem disabled={timeStep === '2005'}>
        <Fragment>
          <Hexagon type={CellTypeEnum.Decolonized} />
          {timeStep === '2005'
            ? t('general.decolonization')
            : t('mapLegend.decolonization', undefined, { year: timeStep })}
        </Fragment>
      </LegendItem>
    </MapLegendsWrapper>
  )
}

export default MapLegend
