import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { getStats, useAllSpeciesStatsForRegion } from '../hooks/useStats'
import {
  ChartType,
  Region,
  StatsBySpecies,
  ValuesBySpeciesID,
  ValuesByYear,
} from '../types'
import {
  ChartTypeButton,
  Page,
  PageContents,
  PageTimeseriesWraper,
  Title,
} from './Page.styled'
import { CloseButton } from '../components/Button.styled'
import { useSetAtom } from 'jotai'
import { currentSpeciesAtom } from '../atoms'
import { useTranslation } from 'react-i18next'
import Hexagon from '../components/Hexagon'
import { CellTypeEnum } from '../constants'
import PageTimeseries from './PageTimeseries'
import RegionPageParagraph from './RegionPageParagraph'

export type RegionPageProps = {
  currentRegionData: Region
  stats: StatsBySpecies
  onRegionClose: Dispatch<SetStateAction<any>>
}

function RegionPage({
  currentRegionData,
  stats,
  onRegionClose,
}: RegionPageProps) {
  const { t } = useTranslation()
  const chartsRef = useRef(null)
  const [chartType, setChartType] = useState<ChartType>('naturallyPresent')
  const currentStats: ValuesBySpeciesID = useAllSpeciesStatsForRegion(
    currentRegionData,
    stats
  )

  const data = useMemo(() => {
    return {
      naturallyPresent: getStats(currentStats, 'bySpecies'),
      willDisappear: getStats(
        currentStats,
        'bySpecies',
        2095,
        'desc',
        CellTypeEnum.Decolonized
      ),
      couldThrive: getStats(
        currentStats,
        'bySpecies',
        2095,
        'desc',
        CellTypeEnum.Suitable
      ),
    } as Record<ChartType, [string, ValuesByYear][]>
  }, [currentStats])

  const setCurrentSpecies = useSetAtom(currentSpeciesAtom)
  const onSpeciesClick = useCallback(
    (d: ValuesByYear) => {
      const species = d.species
      if (!species) return
      setCurrentSpecies(species)
    },
    [setCurrentSpecies]
  )

  const onMoreClick = useCallback(
    (type: ChartType) => {
      setChartType(type)
      ;(chartsRef?.current as any).scrollIntoView()
    },
    [setChartType]
  )

  const region = currentRegionData.label

  // console.log('region stats:', currentStats, region.properties)
  // console.log(naturallyPresent)
  return (
    <Page>
      <Title>
        {currentRegionData.NAME_1}
        <CloseButton onClick={onRegionClose} />
      </Title>
      <PageContents>
        <article>
          <h3>{t('page.today')}</h3>
          <RegionPageParagraph
            data={data.naturallyPresent}
            type={CellTypeEnum.Stable}
            region={region}
            transKey="regionPage.naturallyPresent"
            onMoreClick={() => onMoreClick('naturallyPresent')}
          />

          <h3>{t('page.tomorrow')}</h3>

          <RegionPageParagraph
            data={data.willDisappear}
            type={CellTypeEnum.Decolonized}
            region={region}
            transKey="regionPage.willDisappear"
            onMoreClick={() => onMoreClick('willDisappear')}
          />

          <RegionPageParagraph
            data={data.couldThrive}
            type={CellTypeEnum.Suitable}
            region={region}
            transKey="regionPage.couldThrive"
            onMoreClick={() => onMoreClick('couldThrive')}
          />

          <PageTimeseriesWraper ref={chartsRef}>
            <h3>{t('regionPage.chartsTitle')}</h3>

            <nav>
              <ChartTypeButton
                selected={chartType === 'naturallyPresent'}
                onClick={() => setChartType('naturallyPresent')}
              >
                <Hexagon type={CellTypeEnum.Stable} />
                <span>{t('page.chartTypeNaturallyPresent')}</span>
              </ChartTypeButton>
              <ChartTypeButton
                selected={chartType === 'willDisappear'}
                onClick={() => setChartType('willDisappear')}
              >
                <Hexagon type={CellTypeEnum.Decolonized} />
                <span>{t('page.chartTypeWillDisappear')}</span>
              </ChartTypeButton>
              <ChartTypeButton
                selected={chartType === 'couldThrive'}
                onClick={() => setChartType('couldThrive')}
              >
                <Hexagon type={CellTypeEnum.Suitable} />
                <span>{t('page.chartTypeCouldThrive')}</span>
              </ChartTypeButton>
            </nav>

            {data && (
              <PageTimeseries
                data={data[chartType]}
                onItemClick={onSpeciesClick}
              />
            )}
          </PageTimeseriesWraper>
        </article>
      </PageContents>
    </Page>
  )
}

export default RegionPage
