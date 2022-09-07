import styled from 'styled-components'

export const IntroWrapper = styled.div`
  position: relative;
  z-index: 2;
`

export const IntroSectionWrapper = styled.div`
  width: 100%;
  height: 100vh;
  /* background: ${({ theme }) => theme.colors.dark}; */
  border: 1px solid red;
  color: ${({ theme }) => theme.colors.light};
  display: flex;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.serif};

  & > * {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
  }
`

export const IntroTitle = styled.div`
  background-image: url('./img/introTitle.webp');
  background-size: cover;
  background-position: 50% 0;
`

export const IntroForests = styled.div`
  background: green;
`

export const IntroSpecies = styled.div`
  background: blue;
`

export const IntroMap = styled.div``

export const IntroSpeciesExamplePage = styled.div``
export const IntroSpeciesExampleMap = styled.div``
export const IntroTimesteps = styled.div``
export const IntroCurrent = styled.div``
export const IntroDecolonization = styled.div``
export const IntroSuitable = styled.div``
export const IntroChart = styled.div``
export const IntroRegionMap = styled.div``
export const IntroRegionPage = styled.div``
export const IntroUIExplanation = styled.div`
  & > button {
    background: red;
  }
`
