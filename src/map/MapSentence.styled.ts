import styled from 'styled-components'

export const MapSentenceWrapper = styled.div`
  padding: 0 0 1rem;
  color: ${({ theme }) => theme.colors.light};
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: ${({ theme }) => theme.fontSizes.subtitle};
  line-height: ${({ theme }) => theme.fontSizes.subtitleLineHeight};
  text-shadow: 1px 1px 10px #000, 1px 1px 10px #000;
`
