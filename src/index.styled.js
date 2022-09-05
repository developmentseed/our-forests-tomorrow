import { createGlobalStyle } from 'styled-components'
const styled = { createGlobalStyle }

const GlobalStyles = styled.createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Imbue:opsz,wght@10..100,400;10..100,600&family=Montserrat:ital,wght@0,400;0,700;1,400;1,700&display=swap');

  @font-face {
    font-family: 'ITC Cheltenham Std Book Condensed';
    font-style: normal;
    font-weight: normal;
    src: local('ITC Cheltenham Std Book Condensed'),
      url('./CheltenhamStdBookCond.woff') format('woff');
  }

  @font-face {
    font-family: 'ITC Cheltenham Std Light Condensed';
    font-style: normal;
    font-weight: normal;
    src: local('ITC Cheltenham Std Light Condensed'),
      url('CheltenhamStdLightCond.woff') format('woff');
  }

  @font-face {
    font-family: 'Montserrat';
    src: url('Montserrat-Regular.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Montserrat';
    src: url('Montserrat-Italic.woff2') format('woff2');
    font-weight: normal;
    font-style: italic;
    font-display: swap;
  }

  @font-face {
    font-family: 'Montserrat';
    src: url('Montserrat-Bold.woff2') format('woff2');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  body {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.6rem;
    font-family: ${({ theme }) => theme.fonts.sans};
    color: ${({ theme }) => theme.colors.dark};
    background: ${({ theme }) => theme.colors.background};
  }
  * {
    box-sizing: border-box;
  }

  p {
    line-height: 1.5;
  }
  img {
    max-width: 100%;
  }

  button {
    background: none;
    border: none;
    font-family: ${({ theme }) => theme.fonts.sans};
    cursor: pointer;
  }

  ul,
  li {
    margin: 0;
    padding: 0;
  }
`

export default GlobalStyles
