import {
  ChangeEvent,
  Fragment,
  MouseEvent,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { AllSpeciesData, Locale, SpeciesSortBy, StatsBySpecies } from '../types'
import { currentSpeciesAtom, navSpeciesSortByAtom } from '../atoms'
import Dropdown from '../components/Dropdown'
import SpeciesMenuContent from './SpeciesMenuContent'
import {
  CloseButton,
  Search,
  SortByButton,
  SortByList,
  MenuTools,
} from './Menu.styled'

type SpeciesMenuProps = {
  species: AllSpeciesData
  stats: StatsBySpecies
  closeMenuCallback: () => void
}

function SpeciesMenu({ species, stats, closeMenuCallback }: SpeciesMenuProps) {
  const { t, i18n } = useTranslation()
  const setCurrentSpecies = useSetAtom(currentSpeciesAtom)
  const locale = i18n.language as Locale

  const onSpeciesClick = useCallback(
    (speciesId: string) => {
      setCurrentSpecies(speciesId)
      closeMenuCallback()
    },
    [closeMenuCallback, setCurrentSpecies]
  )

  const [highlightedIds, setHighlightedIds] = useState<string[] | undefined>()
  const onSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const term = e.target.value.toLowerCase()
      if (term === '') {
        setHighlightedIds(undefined)
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

  const [sortBy, setSortBy] = useAtom(navSpeciesSortByAtom)
  const onSortClick = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      const value = (e.target as any).dataset.value
      setSortBy(value as SpeciesSortBy)
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
        } else if (sortBy === 'area') {
          const speciesAStats = stats[speciesKeyA].global
          const speciesBStats = stats[speciesKeyB].global
          return (speciesBStats?.['2005'] || 0) - (speciesAStats?.['2005'] || 0)
        } else return 0
      }
    )
    return Object.fromEntries(speciesSortedArr)
  }, [species, sortBy, locale, stats])

  return (
    <Fragment>
      <MenuTools>
        <div>
          <label>{t('nav.sortBy')}</label>
          <Dropdown
            button={(reference: any, getReferenceProps: any) => (
              <SortByButton ref={reference} {...getReferenceProps()}>
                {t(`nav.sortByOptions.${sortBy}`)}
              </SortByButton>
            )}
          >
            <SortByList onClick={onSortClick}>
              <li data-value="vernacular">
                {t('nav.sortByOptions.vernacular')}
              </li>
              <li data-value="latin">{t('nav.sortByOptions.latin')}</li>
              <li data-value="area">{t('nav.sortByOptions.area')}</li>
            </SortByList>
          </Dropdown>
        </div>
        <div>
          <label>{t('nav.search')}</label>
          <Search
            type="text"
            placeholder={t('nav.searchPlaceholder')}
            onChange={onSearch}
          ></Search>
        </div>
        <CloseButton onClick={closeMenuCallback}></CloseButton>
      </MenuTools>
      <SpeciesMenuContent
        species={sorted}
        showLatin={sortBy === 'latin'}
        onSpeciesClick={onSpeciesClick}
        highlightedIds={highlightedIds}
      />
    </Fragment>
  )
}

export default SpeciesMenu
