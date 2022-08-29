import { useTranslation } from 'react-i18next'
import React from 'react'

function Nav() {
  const { i18n } = useTranslation()
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }
  return (
    <div style={{ background: 'black', position: 'absolute', zIndex: 99 }}>
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
    </div>
  )
}

export default Nav
