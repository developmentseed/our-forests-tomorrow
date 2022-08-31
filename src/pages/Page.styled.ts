import styled from 'styled-components'

interface TitleProps {
  readonly color?: string
}

// TODO use theme color
export const Title = styled.h1<TitleProps>`
  color: ${({ color, theme }) => color || theme.colors.light};
  font-family: ${({ theme }) => theme.fonts.serif};
`
