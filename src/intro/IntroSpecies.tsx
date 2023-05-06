import { useTranslation } from 'react-i18next'
import { AllSpeciesData, Locale } from '../types'
import styled from 'styled-components'

const Item = styled.button`
  font-variant: small-caps;
  margin: 1rem;
  width: 50px;

  & > img {
    border-radius: 50%;
    width: 100%;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    span {
      display: none;
    }
    margin: .4rem;
    width: 35px;

  }
}
`

type IntroSpeciesProps = {
  species: AllSpeciesData
}

function IntroSpeciesList({ species }: IntroSpeciesProps) {
  const { i18n } = useTranslation()
  const locale = i18n.language as Locale
  return (
    <div>
      {Object.entries(species).map(([speciesKey, speciesData]) => (
        <Item key={speciesKey}>
          <img
            src={`img/trees/${speciesData.labels?.en?.name.toLowerCase()}.webp`}
          />
          <span>{speciesData.labels?.[locale]?.name}</span>
        </Item>
      ))}
    </div>
  )
}

export default IntroSpeciesList
