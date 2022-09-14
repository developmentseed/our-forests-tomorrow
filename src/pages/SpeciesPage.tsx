import { useTranslation } from 'react-i18next'
import StatsDropdown from './StatsDropdown'
import { CellTypeEnum } from '../constants'
import { getStats, useStats } from '../hooks/useStats'
import { Locale, SpeciesData, StatsBySpecies, ValuesByYear } from '../types'
import { deckColorToCss } from '../utils'
import { Page, Title, PageContents } from './Page.styled'
import { currentRegionAtom, currentSpeciesAtom } from '../atoms'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useMemo, useRef, useState } from 'react'
import Hexagon from '../components/Hexagon'
import PageTimeseries from './PageTimeseries'

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
          <h3>Today</h3>
          <p>
            {currentSpeciesData.latin} is naturally present in{' '}
            {data.naturallyPresent
              .slice(0, 5)
              .map((d) => d[1].label)
              .join(', ')}
            and{' '}
            <button onClick={() => onMoreClick('naturallyPresent')}>
              {data.naturallyPresent.length} more regions
            </button>
            .
          </p>

          <h3>Tomorrow</h3>

          <p>
            {currentSpeciesData.latin} is likely to disappear from{' '}
            {data.willDisappear
              .slice(0, 5)
              .map((d) => d[1].label)
              .join(', ')}
            and{' '}
            <button onClick={() => onMoreClick('willDisappear')}>
              {data.willDisappear.length} more regions
            </button>
            .
          </p>
          <p>
            {currentSpeciesData.latin}However, by 2095 it could thrive in{' '}
            {data.couldThrive
              .slice(0, 5)
              .map((d) => d[1].label)
              .join(', ')}
            and{' '}
            <button onClick={() => onMoreClick('couldThrive')}>
              {data.couldThrive.length} more regions
            </button>
            .
          </p>

          <div ref={chartsRef}>
            <h3>Evolution of this species across European regions</h3>

            <div>
              <button onClick={() => setChartType('naturallyPresent')}>
                Present today
              </button>
              <button onClick={() => setChartType('willDisappear')}>
                Decolonization in 2095
              </button>
              <button onClick={() => setChartType('couldThrive')}>
                Suitability in 2095
              </button>
            </div>

            {data && (
              <PageTimeseries
                data={data[chartType]}
                onItemClick={onRegionClick}
              />
            )}
          </div>
        </article>
      </PageContents>
    </Page>
  )
}

export default SpeciesPage
