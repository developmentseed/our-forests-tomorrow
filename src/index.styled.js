import { createGlobalStyle } from 'styled-components'
const styled = { createGlobalStyle }

const GlobalStyles = styled.createGlobalStyle`
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



  @font-face {
    font-family: 'EB Garamond';
    src: url('EBGaramond-BoldItalic.woff2') format('woff2');
    font-weight: bold;
    font-style: italic;
    font-display: swap;
  }

  @font-face {
    font-family: 'EB Garamond';
    src: url('EBGaramond-Bold.woff2') format('woff2');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'EB Garamond';
    src: url('EBGaramond-Italic.woff2') format('woff2');
    font-weight: normal;
    font-style: italic;
    font-display: swap;
  }

  @font-face {
    font-family: 'EB Garamond';
    src: url('EBGaramond-Regular.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  body {
    margin: 0;
    font-size: ${({ theme }) => theme.fontSizes.normal};
    line-height: 1.6rem;
    font-family: ${({ theme }) => theme.font};
    color: ${({ theme }) => theme.colors.forest};
    background: ${({ theme }) => theme.colors.pebbleLight};
  }
  * {
    box-sizing: border-box;
  }

  p {
    line-height: ${({ theme }) => theme.fontSizes.normalLineHeight};
  }
  img {
    max-width: 100%;
  }

  button {
    background: none;
    border: none;
    padding: 0;
    font-family: ${({ theme }) => theme.font};
    font-size: ${({ theme }) => theme.fontSizes.normal};
    cursor: pointer;
  }

  ul {
    list-style-type: none;
  }

  ul,
  li {
    margin: 0;
    padding: 0;
  }

  input {
    font-family: ${({ theme }) => theme.font};
  }
`

export default GlobalStyles
