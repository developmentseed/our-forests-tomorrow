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
  // highlightedIds?: string[]
  onRegionClick?: (speciesKey: string) => void
  children?: ReactNode
  closeBtn: ReactNode
}

function RegionsMenuContent({
  regions,
  // highlightedIds,
  onRegionClick,
  children,
  closeBtn,
}: RegionsMenuContentProps) {
  const { t, i18n } = useTranslation()
  const locale = i18n.language as Locale
  const regionsByCountries = useRegionsByCountries(regions)
  console.log(regionsByCountries)
  return (
    <Fragment>
      <CloseButtonWrapper>{closeBtn}</CloseButtonWrapper>
      <MenuColumns>
        {/* <Aside>
        {children || (
          <Trans
            i18nKey="nav.exploreSpecies"
            components={{ b: <b />, p: <p /> }}
          />
        )}
      </Aside> */}

        {regionsByCountries.map((country) => (
          <Country>
            <h3>{country.COUNTRY}</h3>
            <ul>
              <RegionButton>{t('general.entireCountry')}</RegionButton>
              {country.regions?.map((region) => (
                <RegionButton>{region.NAME_1}</RegionButton>
              ))}
            </ul>
          </Country>
        ))}
      </MenuColumns>
    </Fragment>
  )
}

export default RegionsMenuContent
