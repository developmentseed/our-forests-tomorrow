import {
  ChangeEvent,
  Dispatch,
  Fragment,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { AllSpeciesData, Locale, SpeciesSortBy } from '../types'
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

  const [sortBy, setSortBy] = useState<SpeciesSortBy>('vernacular')
  const onSortClick = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setSortBy(e.target.value as SpeciesSortBy)
    },
    [setSortBy]
  )

  const sorted = useMemo(() => {
    const speciesSortedArr = Object.entries(species).sort(
      ([speciesKeyA, speciesDataA], [speciesKeyB, speciesDataB]) => {
        if (sortBy === 'latin') {
          return speciesKeyA.localeCompare(speciesKeyB)
        } else if (sortBy === 'vernacular') {
          return t(`species.${speciesKeyA}`).localeCompare(
            t(`species.${speciesKeyB}`)
          )
        } else return 0
      }
    )
    return Object.fromEntries(speciesSortedArr)
  }, [species, sortBy, t])

  return (
    <Fragment>
      <SpeciesMenuTools>
        <div>
          sort by{' '}
          <select onChange={onSortClick} value={sortBy}>
            <option value="vernacular">Vernacular name</option>
            <option value="latin">Latin name</option>
          </select>
        </div>
        <div>
          search for a species{' '}
          <input
            type="text"
            placeholder="e.g. Irish Oak, mediterranean"
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
          {Object.entries(sorted).map(([speciesKey, speciesData]) => (
            <li key={speciesKey} onClick={() => onSpeciesClick(speciesKey)}>
              <SpeciesButton
                color={deckColorToCss(speciesData.color)}
                disabled={
                  !!highlightedIds && !highlightedIds.includes(speciesKey)
                }
              >
                {sortBy === 'latin'
                  ? speciesKey.replace('_', ' ')
                  : t(`species.${speciesKey}`)}

                <i>
                  {sortBy === 'latin'
                    ? t(`species.${speciesKey}`)
                    : speciesKey.replace('_', ' ')}
                </i>
              </SpeciesButton>
            </li>
          ))}
        </ul>
      </MenuColumns>
    </Fragment>
  )
}

export default SpeciesMenu
