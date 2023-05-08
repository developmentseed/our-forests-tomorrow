import styled from 'styled-components'

interface TitleProps {
  readonly color?: string
}

export const Page = styled.div<{
  full?: boolean
  revealMap?: boolean
}>`
  z-index: 3;
  position: relative;
  pointer-events: all;
  top: ${({ revealMap, theme }) => (revealMap ? theme.mapRevealHeight : '0')};
  max-width: ${({ theme, full }) => (full ? '100%' : theme.breakpoints.laptop)};
  width: ${({ full }) => (full ? '100%' : '70vw')};
  margin: ${({ full }) => (full ? '0' : '0 auto 5rem')};
  padding: 1.2rem 2rem;
  background-color: ${({ theme }) => theme.colors.pebbleLight};
  border-color: ${({ theme }) => theme.colors.snow};
  box-shadow: 0px -4px 20px rgba(30, 47, 47, 0.15);
  border-style: solid;
  border-width: ${({ full }) => (full ? '0' : '8px')};
  border-top-width: 8px;
  border-radius: 6px 6px 0px 0px ${({ full }) => (full ? '0' : '0 auto 5rem')};
  // transition: all 0.3s ease-in-out;
`

export const Title = styled.h1<TitleProps>`
  font-family: ${({ theme }) => theme.font};
  font-size: ${({ theme }) => theme.fontSizes.title};
  line-height: ${({ theme }) => theme.fontSizes.subtitleLineHeight};
  font-variant: small-caps;
  text-transform: lowercase;
  font-weight: 400;
  margin: 0;

  & > p {
    font-size: ${({ theme }) => theme.fontSizes.subtitle};
    margin: 0;
  }
`

export const PageContents = styled.div`
  max-width: ${({ theme }) => theme.breakpoints.laptop};
  margin: 0 auto 5rem;
  display: flex;
  align-items: flex-start;

  & > aside {
    min-width: 300px;
    max-width: 300px;
    margin-right: 2.4rem;

    & > p {
      font-size: ${({ theme }) => theme.fontSizes.small};
      line-height: 1.4rem;
    }

    & > img {
      width: 100%;
      object-fit: contain;
    }
  }

  & h3 {
    font-family: ${({ theme }) => theme.font};
    font-size: ${({ theme }) => theme.fontSizes.subtitle};
    margin: 3.5rem 0 0.6rem;
  }

  & > article > h3:first-child {
    margin-top: 0;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`

export const PageTimeseriesWraper = styled.div`
  & > nav {
    display: flex;
    margin: 1.5rem 0 2rem;
  }
`

export const ChartTypeButton = styled.button<{ selected: boolean }>`
  margin-right: 0.5rem;
  padding: 0.3rem 0.6rem;
  border: 1px solid ${({ theme }) => theme.colors.forestFaded};
  border-radius: 3px;
  opacity: ${({ selected }) => (selected ? 1 : 0.6)};
  font-size: ${({ theme }) => theme.fontSizes.small};
  display: flex;

  & > svg {
    margin-right: 0.3rem;
  }
`
