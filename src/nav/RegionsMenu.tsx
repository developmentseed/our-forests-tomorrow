import { Fragment, useCallback } from 'react'
import { useSetAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { Locale } from '../types'
import { currentRegionAtom } from '../atoms'
import RegionsMenuContent from './RegionsMenuContent'
import { CloseButton, MenuTools } from './Menu.styled'

type RegionsMenuProps = {
  regions: any
  closeMenuCallback: () => void
}

function RegionsMenu({ regions, closeMenuCallback }: RegionsMenuProps) {
  const { t, i18n } = useTranslation()
  const setCurrentRegion = useSetAtom(currentRegionAtom)
  const locale = i18n.language as Locale

  const onRegionClick = useCallback(
    (speciesId: string) => {
      setCurrentRegion(speciesId)
      closeMenuCallback()
    },
    [closeMenuCallback, setCurrentRegion]
  )

  return (
    <Fragment>
      <RegionsMenuContent
        regions={regions}
        onRegionClick={onRegionClick}
        closeBtn={<CloseButton onClick={closeMenuCallback}></CloseButton>}
      />
    </Fragment>
  )
}

export default RegionsMenu
