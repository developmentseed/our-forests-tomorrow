import { ChangeEvent, Fragment, useCallback, useMemo, useState } from 'react'
import { useSetAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { AllSpeciesData, Locale, SpeciesSortBy } from '../types'
import { deckColorToCss } from '../utils'
import { MenuColumns } from './Menu.styled'
import { Aside, SpeciesButton, SpeciesMenuTools } from './SpeciesMenu.styled'
import { currentSpeciesAtom } from '../atoms'
import './SpeciesMenuSpritesheet.css'

type SpeciesMenuProps = {
  species: AllSpeciesData
  closeMenuCallback: () => void
}

function SpeciesMenu({ species, closeMenuCallback }: SpeciesMenuProps) {
  const { i18n } = useTranslation()
  const setCurrentSpecies = useSetAtom(currentSpeciesAtom)
  const locale = i18n.language as Locale
  const onSpeciesClick = useCallback(
    (speciesId: string) => {
      setCurrentSpecies(speciesId)
      closeMenuCallback()
    },
    [closeMenuCallback, setCurrentSpecies]
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
          const labels = speciesData.labels[locale]
          return (
            speciesData.latin.toLowerCase().includes(term) ||
            labels.name.toLocaleLowerCase().includes(term) ||
            labels.extract?.toLocaleLowerCase().includes(term) ||
            labels.aliases?.some((a) => a.toLocaleLowerCase().includes(term))
          )
        })
        .map(([speciesKey]) => speciesKey)
      setHighlightedIds(highlighted)
    },
    [species, locale]
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
          return speciesDataA.labels[locale].name.localeCompare(
            speciesDataB.labels[locale].name
          )
        } else return 0
      }
    )
    return Object.fromEntries(speciesSortedArr)
  }, [species, sortBy, locale])

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
                className={`sprite sprite-${speciesKey}`}
                color={deckColorToCss(speciesData.color)}
                disabled={
                  !!highlightedIds && !highlightedIds.includes(speciesKey)
                }
              >
                {sortBy === 'latin'
                  ? speciesData.latin
                  : speciesData.labels[locale].name}

                <i>
                  {sortBy === 'latin'
                    ? speciesData.labels[locale].name
                    : speciesData.latin}
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
