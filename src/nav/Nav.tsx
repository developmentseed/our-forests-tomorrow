import { useTranslation } from 'react-i18next'
import { NavWrapper } from './Nav.styled'

function Nav() {
  const { i18n } = useTranslation()
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }
  return (
    <NavWrapper>
      <section>
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
      </section>
      <nav>
        <button>species</button>
        <button>regions</button>
      </nav>
    </NavWrapper>
  )
}

export default Nav
