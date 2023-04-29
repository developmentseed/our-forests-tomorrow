import styled from 'styled-components'

interface TitleProps {
  readonly color?: string
}

export const Page = styled.div`
  max-width: ${({ theme }) => theme.breakpoints.laptop};
  width: 70vw;
  max-width: 100%;
  padding: 1.2rem 2rem;
  margin: 0 auto 5rem;
  z-index: 3;
  position: relative;
  top: 70vh;
  background-color: ${({ theme }) => theme.colors.pebbleLight};
  border: 8px solid ${({ theme }) => theme.colors.snow};
  box-shadow: 0px -4px 20px rgba(30, 47, 47, 0.15);
  border-radius: 6px 6px 0px 0px;
`

// TODO use theme color
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
  border-radius: 99px;
  opacity: ${({ selected }) => (selected ? 1 : 0.6)};
  font-size: ${({ theme }) => theme.fontSizes.small};
  display: flex;

  & > svg {
    margin-right: 0.3rem;
  }
`
