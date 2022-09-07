import { ReactNode } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { AllSpeciesData, Locale } from '../types'
import { deckColorToCss } from '../utils'
import { MenuColumns } from './Menu.styled'
import { Aside, SpeciesButton } from './SpeciesMenuContent.styled'

type SpeciesMenuContentProps = {
  species: AllSpeciesData
  onSpeciesClick: (speciesKey: string) => void
  highlightedIds: string[] | null
  showLatin?: boolean
  children?: ReactNode
}

function SpeciesMenuContent({
  species,
  onSpeciesClick,
  highlightedIds,
  showLatin,
  children,
}: SpeciesMenuContentProps) {
  const { t, i18n } = useTranslation()
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
            onClick={() => onSpeciesClick(speciesKey)}
            // className={`sprite sprite-${speciesKey}`}
            color={deckColorToCss(speciesData.color)}
            disabled={!!highlightedIds && !highlightedIds.includes(speciesKey)}
          >
            <b>
              {showLatin ? speciesData.latin : speciesData.labels[locale].name}
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
