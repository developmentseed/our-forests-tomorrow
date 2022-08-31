import { Dispatch, SetStateAction, useCallback } from 'react'
import { AllSpeciesData } from '../types'
import { MenuColumns } from './Menu.styled'

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
  const onSpeciesClick = useCallback(
    (speciesId: string) => {
      onSpeciesChange(speciesId)
      closeMenuCallback()
    },
    [onSpeciesChange, closeMenuCallback]
  )
  return (
    <MenuColumns>
      <ul>
        {Object.entries(species).map(([speciesKey, speciesData]) => (
          <li key={speciesKey} onClick={() => onSpeciesClick(speciesKey)}>
            {speciesKey}
          </li>
          // <li>{speciesData.en.name}</li>
        ))}
      </ul>
    </MenuColumns>
  )
}

export default SpeciesMenu
