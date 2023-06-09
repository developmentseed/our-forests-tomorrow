import { Fragment, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import useRegionsByCountries from '../hooks/useRegionsByCountries'
import { Region } from '../types'
import { Country, MenuColumns, RegionButton } from './RegionsMenuContent.styled'

type RegionsMenuContentProps = {
  regions: Region[]
  onRegionClick: (gid: string) => void
  children?: ReactNode
}

function RegionsMenuContent({
  regions,
  onRegionClick,
}: RegionsMenuContentProps) {
  const { t } = useTranslation()
  const regionsByCountries = useRegionsByCountries(regions)
  return (
    <Fragment>
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
