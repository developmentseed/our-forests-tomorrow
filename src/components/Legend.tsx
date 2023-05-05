import { useAtomValue } from 'jotai'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { timeStepAtom } from '../atoms'
import Hexagon from '../components/Hexagon'
import { CellTypeEnum } from '../constants'
import { LegendWrapper, LegendItem } from './Legend.styled'

function Legend() {
  const { t } = useTranslation()
  const timeStep = useAtomValue(timeStepAtom)
  return (
    <LegendWrapper>
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
    </LegendWrapper>
  )
}

export default Legend
