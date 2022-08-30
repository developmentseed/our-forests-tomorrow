import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider } from 'styled-components'
import './i18n'
import GlobalStyles from './index.styled'
import { THEME } from './constants'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <Suspense fallback="loading...">
      <ThemeProvider theme={THEME}>
        <App />
        <GlobalStyles />
      </ThemeProvider>
    </Suspense>
  </React.StrictMode>
)
