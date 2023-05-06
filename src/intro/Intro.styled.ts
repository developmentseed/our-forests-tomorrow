import styled from 'styled-components'

export const IntroWrapper = styled.div`
  position: relative;
  z-index: 2;
`

export const IntroSectionWrapper = styled.div<{ height?: string }>`
  width: 100%;
  height: ${({ height }) => height || '100vh'};
  color: ${({ theme }) => theme.colors.pebbleLight};
  display: flex;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts};
  font-size: ${({ theme }) => theme.fontSizes.subtitle};
  line-height: ${({ theme }) => theme.fontSizes.subtitleLineHeight};
  text-shadow: 1px 1px 10px #000, 1px 1px 10px #000;

  & > * {
    padding: 3rem;
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;

    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      padding: 1rem;
    }
  }
`

export const IntroTitle = styled.div`
  background-image: url('./img/BG-intro.webp');
  background-size: cover;
  background-position: 50% 0;
  align-items: flex-start;
  /* height: 200vh; */
  & > h1 {
    position: absolute;
    top: 40vh;
    text-align: center;
    font-size: 4rem;
    line-height: 3.3rem;
  }
`

export const IntroForests = styled.div`
  background: ${({ theme }) => theme.colors.forestDark};
  text-shadow: none;
`

export const IntroForests2 = styled.div`
  background-image: url('./img/forest.webp');
  background-size: cover;
  background-position: 50% 0;
`

export const IntroSpecies = styled.div`
  background: ${({ theme }) => theme.colors.forest};
  text-shadow: none;
`
export const IntroSpecies2 = styled.div`
  background: ${({ theme }) => theme.colors.pebbleLight};
`
export const IntroSpecies3 = styled.div`
  text-shadow: none;
  background: ${({ theme }) => theme.colors.forestDark};
`

export const IntroMap = styled.div``

export const IntroSpeciesExamplePage = styled.div`
  background-image: url('./img/quercusilex.webp');
  background-size: cover;
`
export const IntroSpeciesExampleMap = styled.div``
export const IntroCurrent = styled.div``
export const IntroTimesteps = styled.div``
export const IntroDecolonization = styled.div``
export const IntroSuitable = styled.div``
export const IntroChart = styled.div``
export const IntroRegionMap = styled.div``
export const IntroRegionPage = styled.div``
export const IntroUIExplanation = styled.div``
