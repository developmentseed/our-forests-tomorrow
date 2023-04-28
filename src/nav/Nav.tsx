import { useAtomValue } from 'jotai'
import { Trans, useTranslation } from 'react-i18next'
import { introCompletedAtom, introStepAtom } from '../atoms'
import { Logo } from '../components/Logo.styled'
import { SUPPORTED_LANGUAGES } from '../constants_common'
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
        <Logo>
          <Trans i18nKey="nav.title" components={{ b: <span /> }} />
        </Logo>
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
      </NavHeader>
      <NavButtons>
        <nav>
          <NavButton>{t('nav.about')}</NavButton>
          {/* I'd rather use the i18n object as the source of truth but couldn't get this to work - see https://github.com/i18next/i18next/issues/1068  */}
          {SUPPORTED_LANGUAGES.map((lang) => (
            <NavButton
              onClick={() => changeLanguage(lang)}
              style={{
                borderBottomWidth: i18n.language === lang ? '1px' : '0',
              }}
            >
              {lang}
            </NavButton>
          ))}
        </nav>
      </NavButtons>
    </NavWrapper>
  )
}

export default Nav
