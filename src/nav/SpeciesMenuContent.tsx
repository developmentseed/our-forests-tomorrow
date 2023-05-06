import { useTranslation } from 'react-i18next'
import { AllSpeciesData, Locale } from '../types'
import { Species, SpeciesButton } from './SpeciesMenuContent.styled'

type SpeciesMenuContentProps = {
  species: AllSpeciesData
  highlightedIds?: string[]
  onSpeciesClick?: (speciesKey: string) => void
  showLatin?: boolean
}

function SpeciesMenuContent({
  species,
  highlightedIds,
  onSpeciesClick,
  showLatin,
}: SpeciesMenuContentProps) {
  const { i18n } = useTranslation()
  const locale = i18n.language as Locale
  return (
    <Species>
      {Object.entries(species).map(([speciesKey, speciesData]) => (
        <SpeciesButton
          key={speciesKey}
          onClick={
            onSpeciesClick ? () => onSpeciesClick(speciesKey) : undefined
          }
          disabled={!!highlightedIds && !highlightedIds.includes(speciesKey)}
        >
          <img
            src={`img/trees/${speciesData.labels?.en?.name.toLowerCase()}.webp`}
          />
          {showLatin ? speciesData.latin : speciesData.labels?.[locale]?.name}
        </SpeciesButton>
      ))}
    </Species>
  )
}

export default SpeciesMenuContent
