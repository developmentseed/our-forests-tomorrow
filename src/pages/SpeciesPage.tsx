import { useTranslation } from 'react-i18next'
import StatsDropdown from './StatsDropdown'
import { CellTypeEnum } from '../constants'
import { useStats } from '../hooks/useStats'
import { Locale, SpeciesData, StatsBySpecies, ValuesByYear } from '../types'
import { deckColorToCss } from '../utils'
import { Page, Title, PageContents } from './Page.styled'
import { currentRegionAtom, currentSpeciesAtom } from '../atoms'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'
import Hexagon from '../components/Hexagon'

export type SpeciesPageProps = {
  currentSpeciesData: SpeciesData
  stats: StatsBySpecies
}

function SpeciesPage({ currentSpeciesData, stats }: SpeciesPageProps) {
  const { t, i18n } = useTranslation()
  const currentSpecies = useAtomValue(currentSpeciesAtom)
  const setCurrentRegion = useSetAtom(currentRegionAtom)

  const locale = i18n.language as Locale
  const currentStats = stats[currentSpecies]

  const naturallyPresent = useStats(currentStats, 'byRegion')
  const willDisappear = useStats(
    currentStats,
    'byRegion',
    2095,
    'desc',
    CellTypeEnum.Decolonized
  )
  const couldThrive = useStats(
    currentStats,
    'byRegion',
    2095,
    'desc',
    CellTypeEnum.Suitable
  )

  const onRegionClick = useCallback(
    (d: ValuesByYear) => {
      const region = d.region
      if (!region) return
      setCurrentRegion(region.GID_1 || region.GID_0)
    },
    [setCurrentRegion]
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
          {currentSpeciesData.latin} is naturally present in{' '}
          <StatsDropdown
            data={naturallyPresent}
            color={currentSpeciesData.color}
            onItemClick={onRegionClick}
          />
          . By 2095, that species is likely to disappear from{' '}
          <StatsDropdown
            data={willDisappear}
            color={currentSpeciesData.color}
            onItemClick={onRegionClick}
          />
          . However, by 2095 it could thrive in{' '}
          <StatsDropdown
            data={couldThrive}
            color={currentSpeciesData.color}
            onItemClick={onRegionClick}
          />
          <Hexagon type={CellTypeEnum.Suitable} />
        </article>
      </PageContents>
    </Page>
  )
}

export default SpeciesPage
