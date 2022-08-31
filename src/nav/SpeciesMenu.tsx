import { Dispatch, Fragment, SetStateAction, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { AllSpeciesData } from '../types'
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
  const { t } = useTranslation()
  const onSpeciesClick = useCallback(
    (speciesId: string) => {
      onSpeciesChange(speciesId)
      closeMenuCallback()
    },
    [onSpeciesChange, closeMenuCallback]
  )

  return (
    <Fragment>
      <SpeciesMenuTools>
        <div>sort by</div>
        <div>search for a species</div>
        <button onClick={closeMenuCallback}>close</button>
      </SpeciesMenuTools>
      <MenuColumns>
        <Aside>
          Explore the possible future of <b>67</b> tree species
        </Aside>
        <ul>
          {Object.entries(species).map(([speciesKey, speciesData]) => (
            <li key={speciesKey} onClick={() => onSpeciesClick(speciesKey)}>
              <SpeciesButton color={deckColorToCss(speciesData.color)}>
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
