import { useTranslation } from 'react-i18next'
import StatsDropdown from '../components/StatsDropdown'
import { CellTypeEnum } from '../constants'
import { useStats } from '../hooks/useStats'
import { Locale, SpeciesData, StatsBySpecies } from '../types'
import { deckColorToCss } from '../utils'

export type SpeciesPageProps = {
  currentSpecies: string
  currentSpeciesData: SpeciesData
  stats: StatsBySpecies
}

function SpeciesPage({
  currentSpecies,
  currentSpeciesData,
  stats,
}: SpeciesPageProps) {
  const { t, i18n } = useTranslation()
  const locale = i18n.language as Locale
  const currentStats = stats[currentSpecies]
  const name = t(`species.${currentSpecies}`)

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
    <header>
      <h1
        style={{
          color: deckColorToCss(currentSpeciesData.color),
        }}
      >
        {currentSpecies}, {name}
      </h1>
      <div>
        {name} is naturally present in{' '}
        <StatsDropdown
          data={naturallyPresent}
          color={currentSpeciesData.color}
        />
        . By 2095, that species is likely to disappear from{' '}
        <StatsDropdown data={willDisappear} color={currentSpeciesData.color} />.
        However, by 2095 it could thrive in{' '}
        <StatsDropdown data={couldThrive} color={currentSpeciesData.color} />
      </div>
      <p>{currentSpeciesData.labels[locale].extract}</p>
    </header>
  )
}

export default SpeciesPage
