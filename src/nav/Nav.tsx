import { useAtomValue } from 'jotai'
import { Trans, useTranslation } from 'react-i18next'
import { introCompletedAtom, introStepAtom } from '../atoms'
import { IntroStepEnum } from '../intro/Intro'
import { AllSpeciesData, StatsBySpecies } from '../types'
import Menu from './Menu'
import { NavButton, NavButtons, NavHeader, NavWrapper } from './Nav.styled'
import RegionsMenu from './RegionsMenu'
import SpeciesMenu from './SpeciesMenu'

type NavProps = {
  species: AllSpeciesData
  regions: any
  stats: StatsBySpecies
}

function Nav({ species, regions, stats }: NavProps) {
  const { t, i18n } = useTranslation()
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }
  const introStep = useAtomValue(introStepAtom)
  const introCompleted = useAtomValue(introCompletedAtom)

  return (
    <NavWrapper visible={introCompleted || introStep > IntroStepEnum.Title}>
      <NavHeader>
        <h1>
          <Trans i18nKey="nav.title" components={{ b: <b /> }} />
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
        <Menu
          label={t('nav.species')}
          visible={introCompleted || introStep >= IntroStepEnum.Species}
        >
          {(closeMenuCallback: any) => (
            <SpeciesMenu
              species={species}
              stats={stats}
              closeMenuCallback={closeMenuCallback}
            />
          )}
        </Menu>
        <Menu
          visible={introCompleted || introStep >= IntroStepEnum.RegionMap}
          label={t('nav.regions')}
        >
          {(closeMenuCallback: any) => (
            <RegionsMenu
              regions={regions}
              closeMenuCallback={closeMenuCallback}
            />
          )}
        </Menu>
      </NavButtons>
    </NavWrapper>
  )
}

export default Nav
