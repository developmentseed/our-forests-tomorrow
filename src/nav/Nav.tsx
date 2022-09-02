import { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { AllSpeciesData } from '../types'
import Menu from './Menu'
import { NavButton, NavButtons, NavHeader, NavWrapper } from './Nav.styled'
import SpeciesMenu from './SpeciesMenu'

type NavProps = {
  species: AllSpeciesData
}

function Nav({ species }: NavProps) {
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
          <NavButton>about</NavButton>
          <NavButton
            onClick={() => changeLanguage('en')}
            style={{ borderWidth: i18n.language === 'en' ? '2px' : '1px' }}
          >
            en
          </NavButton>
          <NavButton
            onClick={() => changeLanguage('fr')}
            style={{ borderWidth: i18n.language === 'fr' ? '2px' : '1px' }}
          >
            fr
          </NavButton>
        </nav>
      </NavHeader>
      <NavButtons>
        <Menu label="species">
          {(closeMenuCallback: any) => (
            <SpeciesMenu
              species={species}
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
