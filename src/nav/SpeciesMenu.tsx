import {
  ChangeEvent,
  Dispatch,
  Fragment,
  SetStateAction,
  useCallback,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { AllSpeciesData, Locale } from '../types'
import { deckColorToCss } from '../utils'
import { MenuColumns } from './Menu.styled'
import { Aside, SpeciesButton, SpeciesMenuTools } from './SpeciesMenu.styled'

type SpeciesMenuProps = {
  species: AllSpeciesData
  onSpeciesChange: Dispatch<SetStateAction<string>>
  closeMenuCallback: () => void
}

function SpeciesMenu({
  species,
  onSpeciesChange,
  closeMenuCallback,
}: SpeciesMenuProps) {
  const { t, i18n } = useTranslation()
  const locale = i18n.language as Locale
  const onSpeciesClick = useCallback(
    (speciesId: string) => {
      onSpeciesChange(speciesId)
      closeMenuCallback()
    },
    [onSpeciesChange, closeMenuCallback]
  )

  const [highlightedIds, setHighlightedIds] = useState<string[] | null>(null)
  const onSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const term = e.target.value.toLowerCase()
      if (term === '') {
        setHighlightedIds(null)
        return
      }
      const highlighted = Object.entries(species)
        .filter(([speciesKey, speciesData]) => {
          console.log(speciesData.labels[locale].extract)
          return (
            speciesKey.replace('_', ' ').toLowerCase().includes(term) ||
            t(`species.${speciesKey}`).toLocaleLowerCase().includes(term) ||
            speciesData.labels[locale].extract
              ?.toLocaleLowerCase()
              .includes(term) ||
            speciesData.labels[locale].aliases?.some((a) =>
              a.toLocaleLowerCase().includes(term)
            )
          )
        })
        .map(([speciesKey]) => speciesKey)
      setHighlightedIds(highlighted)
    },
    [species, t, locale]
  )

  return (
    <Fragment>
      <SpeciesMenuTools>
        <div>sort by</div>
        <div>
          search for a species{' '}
          <input
            type="text"
            placeholder="e.g. Irish Oak"
            onChange={onSearch}
          ></input>
        </div>
        <button onClick={closeMenuCallback}>close</button>
      </SpeciesMenuTools>
      <MenuColumns>
        <Aside>
          Explore the possible future of <b>67</b> tree species
        </Aside>
        <ul>
          {Object.entries(species).map(([speciesKey, speciesData]) => (
            <li key={speciesKey} onClick={() => onSpeciesClick(speciesKey)}>
              <SpeciesButton
                color={deckColorToCss(speciesData.color)}
                disabled={
                  !!highlightedIds && !highlightedIds.includes(speciesKey)
                }
              >
                {t(`species.${speciesKey}`)}
              </SpeciesButton>
            </li>
          ))}
        </ul>
      </MenuColumns>
    </Fragment>
  )
}

export default SpeciesMenu
