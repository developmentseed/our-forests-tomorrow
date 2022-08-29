import './SpeciesChoice.css'
import { Dispatch, SetStateAction, useCallback } from 'react'
import cx from 'classnames'
import { SPECIES_COLORS, SPECIES_IDS } from './constants'
import { deckColorToCss } from './utils'
import { useTranslation } from 'react-i18next'

export type SpeciesChoiceProps = {
  species: string
  onSpeciesChange: Dispatch<SetStateAction<string>>
}

function SpeciesChoice({ species, onSpeciesChange }: SpeciesChoiceProps) {
  const { t } = useTranslation()
  const onSpeciesClick = useCallback(
    (speciesId: string) => {
      onSpeciesChange(speciesId)
    },
    [onSpeciesChange]
  )
  return (
    <div className="speciesChoice">
      <h1>{t('nav.species')}:</h1>
      <div className="speciesMenu">
        {SPECIES_IDS.map((speciesId) => (
          <div
            onClick={() => onSpeciesClick(speciesId)}
            key={speciesId}
            className={cx('speciesSection', {
              selected: speciesId === species,
            })}
            style={{
              borderColor: deckColorToCss(SPECIES_COLORS[speciesId]),
            }}
          >
            <div className="label">{speciesId}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SpeciesChoice
