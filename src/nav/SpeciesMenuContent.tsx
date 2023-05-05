import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { AllSpeciesData, Locale } from '../types'
import { deckColorToCss } from '../utils'
import { Species, SpeciesButton } from './SpeciesMenuContent.styled'

type SpeciesMenuContentProps = {
  species: AllSpeciesData
  highlightedIds?: string[]
  onSpeciesClick?: (speciesKey: string) => void
  showLatin?: boolean
  children?: ReactNode
}

function SpeciesMenuContent({
  species,
  highlightedIds,
  onSpeciesClick,
  showLatin,
  children,
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
            // className={`sprite sprite-${speciesKey}`}
            color={deckColorToCss(speciesData.color)}
            disabled={!!highlightedIds && !highlightedIds.includes(speciesKey)}
          >

              {showLatin
                ? speciesData.latin
                : speciesData.labels?.[locale]?.name}

            {/* <i>
        {showLatin
          ? speciesData.labels[locale].name
          : speciesData.latin}
      </i> */}
          </SpeciesButton>
        ))}

    </Species>
  )
}

export default SpeciesMenuContent
