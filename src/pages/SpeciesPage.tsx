import { useTranslation } from 'react-i18next'
import StatsDropdown from './StatsDropdown'
import { CellTypeEnum } from '../constants'
import { useStats } from '../hooks/useStats'
import { Locale, SpeciesData, StatsBySpecies } from '../types'
import { deckColorToCss } from '../utils'
import { Page, Title, PageContents } from './Page.styled'
import { currentSpeciesAtom } from '../atoms'
import { useAtomValue } from 'jotai'

export type SpeciesPageProps = {
  currentSpeciesData: SpeciesData
  stats: StatsBySpecies
}

function SpeciesPage({ currentSpeciesData, stats }: SpeciesPageProps) {
  const { t, i18n } = useTranslation()
  const locale = i18n.language as Locale
  const currentSpecies = useAtomValue(currentSpeciesAtom)
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

  return (
    <Page>
      <Title color={deckColorToCss(currentSpeciesData.color)}>
        <b>{currentSpeciesData.labels[locale].name}</b>
        {currentSpeciesData.latin}
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
          />
          . By 2095, that species is likely to disappear from{' '}
          <StatsDropdown
            data={willDisappear}
            color={currentSpeciesData.color}
          />
          . However, by 2095 it could thrive in{' '}
          <StatsDropdown data={couldThrive} color={currentSpeciesData.color} />
        </article>
      </PageContents>
    </Page>
  )
}

export default SpeciesPage
