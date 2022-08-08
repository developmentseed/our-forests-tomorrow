import './SpeciesChoice.css'
import { Dispatch, SetStateAction, useCallback } from 'react'
import cx from 'classnames'
import { SPECIES_COLORS, SPECIES_IDS } from './constants'
import { deckColorToCss } from './utils'
import { RegionFeature } from './types'

export type SpeciesChoiceProps = {
  species: string
  region: RegionFeature | null
  onSpeciesChange: Dispatch<SetStateAction<string>>
  onRegionClose: Dispatch<SetStateAction<any>>
}

function SpeciesChoice({
  species,
  region,
  onSpeciesChange,
  onRegionClose,
}: SpeciesChoiceProps) {
  const onSpeciesClick = useCallback(
    (speciesId: string) => {
      onSpeciesChange(speciesId)
    },
    [onSpeciesChange]
  )
  return (
    <div className={cx('speciesChoice', { hasRegion: region !== null })}>
      {region ? (
        <h1>
          Species in {region.properties.name_en}{' '}
          <button onClick={onRegionClose}></button>
        </h1>
      ) : (
        <h1>Species:</h1>
      )}
      <div className="speciesMenu">
        {SPECIES_IDS.map((speciesId) => (
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
              backgroundColor: deckColorToCss(SPECIES_COLORS[speciesId]),
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
