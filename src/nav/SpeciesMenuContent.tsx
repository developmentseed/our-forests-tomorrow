import { ReactNode } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { AllSpeciesData, Locale } from '../types'
import { deckColorToCss } from '../utils'
import { Aside, MenuColumns, SpeciesButton } from './SpeciesMenuContent.styled'

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
    <MenuColumns>
      <Aside>
        {children || (
          <Trans
            i18nKey="nav.exploreSpecies"
            components={{ b: <b />, p: <p /> }}
          />
        )}
      </Aside>
      <ul>
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
            <b>
              {showLatin
                ? speciesData.latin
                : speciesData.labels?.[locale]?.name}
            </b>
            {/* <i>
        {showLatin
          ? speciesData.labels[locale].name
          : speciesData.latin}
      </i> */}
          </SpeciesButton>
        ))}
      </ul>
    </MenuColumns>
  )
}

export default SpeciesMenuContent
