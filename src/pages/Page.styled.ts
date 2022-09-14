import styled from 'styled-components'

interface TitleProps {
  readonly color?: string
}

export const Page = styled.div`
  width: ${({ theme }) => theme.breakpoints.laptop};
  max-width: 100%;
  padding: 1.2rem 2rem;
  margin: 0 auto 5rem;
`

// TODO use theme color
export const Title = styled.h1<TitleProps>`
  /* color: ${({ color, theme }) => color || theme.colors.light}; */
  color: ${({ theme }) => theme.colors.dark};
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: ${({ theme }) => theme.fontSizes.title};
  line-height: ${({ theme }) => theme.fontSizes.subtitleLineHeight};

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
