import { Trans, useTranslation } from 'react-i18next'
import { AllSpeciesData } from '../types'
import Menu from './Menu'
import { NavButton, NavButtons, NavHeader, NavWrapper } from './Nav.styled'
import SpeciesMenu from './SpeciesMenu'

type NavProps = {
  species: AllSpeciesData
}

function Nav({ species }: NavProps) {
  const { t, i18n } = useTranslation()
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <NavWrapper>
      <NavHeader>
        <h1>
          <Trans
            i18nKey="nav.title" // optional -> fallbacks to defaults if not provided
            components={{ b: <b /> }}
          />
        </h1>
        <nav>
          <NavButton>{t('nav.about')}</NavButton>
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
        <Menu label={t('nav.species')}>
          {(closeMenuCallback: any) => (
            <SpeciesMenu
              species={species}
              closeMenuCallback={closeMenuCallback}
            />
          )}
        </Menu>
        <Menu label={t('nav.regions')}>
          {(closeMenuCallback: any) => <div>hello</div>}
        </Menu>
      </NavButtons>
    </NavWrapper>
  )
}

export default Nav
