import './SpeciesChoice.css'
import { Dispatch, SetStateAction, useCallback } from 'react'
import cx from 'classnames'
import { SPECIES_COLORS, SPECIES_IDS } from './constants'

export type SpeciesChoiceProps = {
  species: string
  onSpeciesChange: Dispatch<SetStateAction<string>>
}

function SpeciesChoice({ species, onSpeciesChange }: SpeciesChoiceProps) {
  console.log('lalla')
  const onSpeciesClick = useCallback(
    (speciesId: string) => {
      onSpeciesChange(speciesId)
    },
    [onSpeciesChange]
  )
  return (
    <div className="speciesChoice">
      {SPECIES_IDS.map((speciesId, i) => (
        <div
          onClick={() => onSpeciesClick(speciesId)}
          key={speciesId}
          className={cx('speciesSection', {
            selected: speciesId === species,
            available:
              speciesId === 'Fraxinus_excelsior' ||
              speciesId === 'Quercus_ilex',
          })}
          style={{
            backgroundColor: SPECIES_COLORS[i],
          }}
        ></div>
      ))}
    </div>
  )
}

export default SpeciesChoice
