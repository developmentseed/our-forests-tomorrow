import { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { AllSpeciesData } from '../types'
import Menu from './Menu'
import { NavButtons, NavHeader, NavWrapper } from './Nav.styled'
import SpeciesMenu from './SpeciesMenu'

type NavProps = {
  species: AllSpeciesData
  onSpeciesChange: Dispatch<SetStateAction<string>>
}

function Nav({ species, onSpeciesChange }: NavProps) {
  const { i18n } = useTranslation()
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <NavWrapper>
      <NavHeader>
        <h1>
          <b>Our forests</b> tomorrow
        </h1>
        <nav>
          <button>about</button>
          <button
            type="button"
            onClick={() => changeLanguage('en')}
            style={{ borderWidth: i18n.language === 'en' ? '2px' : '1px' }}
          >
            en
          </button>
          <button
            type="button"
            onClick={() => changeLanguage('fr')}
            style={{ borderWidth: i18n.language === 'fr' ? '2px' : '1px' }}
          >
            fr
          </button>
        </nav>
      </NavHeader>
      <NavButtons>
        <Menu label="species">
          {(closeMenuCallback: any) => (
            <SpeciesMenu
              species={species}
              onSpeciesChange={onSpeciesChange}
              closeMenuCallback={closeMenuCallback}
            />
          )}
        </Menu>
        <Menu label="regions">
          {(closeMenuCallback: any) => <div>hello</div>}
        </Menu>
      </NavButtons>
    </NavWrapper>
  )
}

export default Nav
