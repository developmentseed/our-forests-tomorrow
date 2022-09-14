import { useTranslation } from 'react-i18next'
import StatsDropdown from './StatsDropdown'
import { CellTypeEnum } from '../constants'
import { getStats, useStats } from '../hooks/useStats'
import { Locale, SpeciesData, StatsBySpecies, ValuesByYear } from '../types'
import { deckColorToCss } from '../utils'
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
import PageParagraph from './PageParagraph'

export type SpeciesPageProps = {
  currentSpeciesData: SpeciesData
  stats: StatsBySpecies
}

type ChartType = 'naturallyPresent' | 'willDisappear' | 'couldThrive'

function SpeciesPage({ currentSpeciesData, stats }: SpeciesPageProps) {
  const { t, i18n } = useTranslation()
  const currentSpecies = useAtomValue(currentSpeciesAtom)
  const setCurrentRegion = useSetAtom(currentRegionAtom)
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

  const chartsRef = useRef(null)
  const onMoreClick = useCallback(
    (type: ChartType) => {
      setChartType(type)
      ;(chartsRef?.current as any).scrollIntoView()
    },
    [setChartType]
  )

  return (
    <Page>
      <Title /*color={deckColorToCss(currentSpeciesData.color)}*/>
        {currentSpeciesData.labels[locale].name}
        <p>{currentSpeciesData.latin}</p>
      </Title>

      <PageContents>
        <aside>
          <p>{currentSpeciesData.labels[locale].extract}</p>
          <img
            src={currentSpeciesData.thumbnail.source}
            // width={currentSpeciesData.thumbnail.width}
            // height={currentSpeciesData.thumbnail.height}
            alt={currentSpeciesData.labels[locale].name}
          />
        </aside>
        <article>
          <h3>{t('speciesPage.today')}</h3>
          <PageParagraph
            data={data.naturallyPresent}
            type={CellTypeEnum.Stable}
            species={currentSpeciesData.latin}
            transKey="speciesPage.naturallyPresent"
            onMoreClick={() => onMoreClick('naturallyPresent')}
          />

          <h3>{t('speciesPage.tomorrow')}</h3>

          <PageParagraph
            data={data.willDisappear}
            type={CellTypeEnum.Decolonized}
            species={currentSpeciesData.latin}
            transKey="speciesPage.willDisappear"
            onMoreClick={() => onMoreClick('willDisappear')}
          />

          <PageParagraph
            data={data.couldThrive}
            type={CellTypeEnum.Suitable}
            species={currentSpeciesData.latin}
            transKey="speciesPage.couldThrive"
            onMoreClick={() => onMoreClick('couldThrive')}
          />

          <PageTimeseriesWraper ref={chartsRef}>
            <h3>{t('speciesPage.chartsTitle')}</h3>

            <div>
              <ChartTypeButton
                selected={chartType === 'naturallyPresent'}
                onClick={() => setChartType('naturallyPresent')}
              >
                <Hexagon type={CellTypeEnum.Stable} />
                <span>{t('speciesPage.chartTypeNaturallyPresent')}</span>
              </ChartTypeButton>
              <ChartTypeButton
                selected={chartType === 'willDisappear'}
                onClick={() => setChartType('willDisappear')}
              >
                <Hexagon type={CellTypeEnum.Decolonized} />
                <span>{t('speciesPage.chartTypeWillDisappear')}</span>
              </ChartTypeButton>
              <ChartTypeButton
                selected={chartType === 'couldThrive'}
                onClick={() => setChartType('couldThrive')}
              >
                <Hexagon type={CellTypeEnum.Suitable} />
                <span>{t('speciesPage.chartTypeCouldThrive')}</span>
              </ChartTypeButton>
            </div>

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
