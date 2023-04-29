import { useTranslation } from 'react-i18next'
import { CellTypeEnum } from '../constants'
import { getStats } from '../hooks/useStats'
import {
  ChartType,
  Locale,
  SpeciesData,
  StatsBySpecies,
  ValuesByYear,
} from '../types'
import {
  Page,
  Title,
  PageContents,
  PageTimeseriesWraper,
  ChartTypeButton,
} from './Page.styled'
import { currentRegionAtom, currentSpeciesAtom } from '../atoms'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useMemo, useRef, useState } from 'react'
import Hexagon from '../components/Hexagon'
import PageTimeseries from './PageTimeseries'
import SpeciesPageParagraph from './SpeciesPageParagraph'
import MapSentence from '../map/MapSentence'
import MapTimeseries from '../map/MapTimeseries'
import MapLegend from '../map/MapLegend'
import SummarySentence from '../components/SummarySentence'
import InteractiveTimeseries from '../components/InteractiveTimeseries'
import Legend from '../components/Legend'

export type SpeciesPageProps = {
  currentSpeciesData: SpeciesData
  stats: StatsBySpecies
}

function SpeciesPage({ currentSpeciesData, stats }: SpeciesPageProps) {
  const { t, i18n } = useTranslation()
  const currentSpecies = useAtomValue(currentSpeciesAtom)
  const setCurrentRegion = useSetAtom(currentRegionAtom)
  const chartsRef = useRef(null)
  const [chartType, setChartType] = useState<ChartType>('naturallyPresent')

  const locale = i18n.language as Locale
  const currentStats = stats[currentSpecies]

  const data = useMemo(() => {
    return {
      naturallyPresent: getStats(currentStats, 'byRegion'),
      willDisappear: getStats(
        currentStats,
        'byRegion',
        2095,
        'desc',
        CellTypeEnum.Decolonized
      ),
      couldThrive: getStats(
        currentStats,
        'byRegion',
        2095,
        'desc',
        CellTypeEnum.Suitable
      ),
    } as Record<ChartType, [string, ValuesByYear][]>
  }, [currentStats])

  const onRegionClick = useCallback(
    (d: ValuesByYear) => {
      const region = d.region
      if (!region) return
      setCurrentRegion(region.GID_1 || region.GID_0)
    },
    [setCurrentRegion]
  )

  const onMoreClick = useCallback(
    (type: ChartType) => {
      setChartType(type)
      ;(chartsRef?.current as any).scrollIntoView({ behavior: 'smooth' })
    },
    [setChartType]
  )

  return (
    <Page>
      <PageContents>
        <aside>
          <Title>
            {currentSpeciesData.labels[locale].name}
            <p>{currentSpeciesData.latin}</p>
          </Title>
          <p>{currentSpeciesData.labels[locale].extract}</p>
          <img
            src={currentSpeciesData.thumbnail.source}
            // width={currentSpeciesData.thumbnail.width}
            // height={currentSpeciesData.thumbnail.height}
            alt={currentSpeciesData.labels[locale].name}
          />
        </aside>
        <article>
          <SummarySentence />
          <InteractiveTimeseries />
          <Legend />
          <h3>{t('page.today')}</h3>
          <SpeciesPageParagraph
            data={data.naturallyPresent}
            type={CellTypeEnum.Stable}
            species={currentSpeciesData.latin}
            transKey="speciesPage.naturallyPresent"
            onMoreClick={() => onMoreClick('naturallyPresent')}
          />

          <h3>{t('page.tomorrow')}</h3>

          <SpeciesPageParagraph
            data={data.willDisappear}
            type={CellTypeEnum.Decolonized}
            species={currentSpeciesData.latin}
            transKey="speciesPage.willDisappear"
            onMoreClick={() => onMoreClick('willDisappear')}
          />

          <SpeciesPageParagraph
            data={data.couldThrive}
            type={CellTypeEnum.Suitable}
            species={currentSpeciesData.latin}
            transKey="speciesPage.couldThrive"
            onMoreClick={() => onMoreClick('couldThrive')}
          />

          <PageTimeseriesWraper ref={chartsRef}>
            <h3>{t('speciesPage.chartsTitle')}</h3>

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
                onItemClick={onRegionClick}
              />
            )}
          </PageTimeseriesWraper>
        </article>
      </PageContents>
    </Page>
  )
}

export default SpeciesPage
