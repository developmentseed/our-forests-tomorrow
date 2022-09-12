import { Region } from '../types'

function useRegionsByCountries(regions: Region[]) {
  const countries = regions.filter((r) => !r.GID_1)

  countries.forEach((c) => {
    const countryRegions = regions.filter(
      (r) => r.COUNTRY === c.COUNTRY && r.GID_1
    )
    c.regions = countryRegions
  })

  return countries
}

export default useRegionsByCountries
