import { t } from 'i18next'
import { Fragment, ReactNode } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import useRegionsByCountries from '../hooks/useRegionsByCountries'
import { Locale, Region } from '../types'
import {
  CloseButtonWrapper,
  Country,
  MenuColumns,
  RegionButton,
} from './RegionsMenuContent.styled'

type RegionsMenuContentProps = {
  regions: Region[]
  onRegionClick: (gid: string) => void
  children?: ReactNode
  closeBtn: ReactNode
}

function RegionsMenuContent({
  regions,
  onRegionClick,
  closeBtn,
}: RegionsMenuContentProps) {
  const { t, i18n } = useTranslation()
  const locale = i18n.language as Locale
  const regionsByCountries = useRegionsByCountries(regions)
  return (
    <Fragment>
      <CloseButtonWrapper>{closeBtn}</CloseButtonWrapper>
      <MenuColumns>
        {regionsByCountries.map((country) => (
          <Country>
            <h3>{country.COUNTRY}</h3>
            <ul>
              <RegionButton onClick={() => onRegionClick(country.GID_0)}>
                {t('general.entireCountry')}
              </RegionButton>
              {country.regions?.map((region) => (
                <RegionButton
                  onClick={() => onRegionClick(region.GID_1 as string)}
                >
                  {region.NAME_1}
                </RegionButton>
              ))}
            </ul>
          </Country>
        ))}
      </MenuColumns>
    </Fragment>
  )
}

export default RegionsMenuContent
