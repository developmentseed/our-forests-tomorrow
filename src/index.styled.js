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

  body {
    font-family: 'Montserrat', sans-serif;
    color: ${({ theme }) => theme.colors.light};
    background: ${({ theme }) => theme.colors.dark};
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
`

export default GlobalStyles
