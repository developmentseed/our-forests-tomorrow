import styled from 'styled-components'

interface TitleProps {
  readonly color?: string
}

export const Page = styled.div`
  width: ${({ theme }) => theme.breakpoints.mobile};
  max-width: 100%;
  padding: 1.2rem 2rem;
  margin: 0 auto 5rem;
`

// TODO use theme color
export const Title = styled.h1<TitleProps>`
  /* color: ${({ color, theme }) => color || theme.colors.light}; */
  color: ${({ theme }) => theme.colors.dark};
  font-family: ${({ theme }) => theme.fonts.serif};

  & > b {
    font-size: ${({ theme }) => theme.fontSizes.title};
    display: block;
  }

  font-size: ${({ theme }) => theme.fontSizes.subtitle};
  line-height: ${({ theme }) => theme.fontSizes.subtitleLineHeight};
`

export const PageContents = styled.div`
  display: flex;

  & > aside {
    min-width: 300px;
    background: ${({ theme }) => theme.colors.light};
    margin-right: 2.4rem;

    & > p {
      margin: 1rem;
      font-size: ${({ theme }) => theme.fontSizes.small};
      line-height: 1.4rem;
    }

    & > img {
      width: 100%;
      object-fit: contain;
    }
  }
`
