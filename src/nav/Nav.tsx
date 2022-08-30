import { useTranslation } from 'react-i18next'
import Menu from './Menu'
import { NavButtons, NavHeader, NavWrapper } from './Nav.styled'

function Nav() {
  const { i18n } = useTranslation()
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <NavWrapper>
      <NavHeader>
        <h1>Our trees future</h1>
        <nav>
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
        <Menu label="species">species</Menu>
        <Menu label="regions">regions</Menu>
      </NavButtons>
    </NavWrapper>
  )
}

export default Nav
