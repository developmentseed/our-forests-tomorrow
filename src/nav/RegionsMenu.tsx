import { Fragment, useCallback } from 'react'
import { useSetAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { Locale } from '../types'
import { currentRegionAtom } from '../atoms'
import RegionsMenuContent from './RegionsMenuContent'

import { CloseButtonWrapper } from './Menu.styled'
import { CloseButton } from '../components/CloseButton.styled'

type RegionsMenuProps = {
  regions: any
  closeMenuCallback: () => void
}

function RegionsMenu({ regions, closeMenuCallback }: RegionsMenuProps) {
  const setCurrentRegion = useSetAtom(currentRegionAtom)

  const onRegionClick = useCallback(
    (speciesId: string) => {
      setCurrentRegion(speciesId)
      closeMenuCallback()
    },
    [closeMenuCallback, setCurrentRegion]
  )

  return (
    <Fragment>
      <CloseButtonWrapper>
        <CloseButton onClick={closeMenuCallback}>Close</CloseButton>
      </CloseButtonWrapper>
      <RegionsMenuContent regions={regions} onRegionClick={onRegionClick} />
    </Fragment>
  )
}

export default RegionsMenu
