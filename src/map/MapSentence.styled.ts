import styled from 'styled-components'

export const MapSentenceWrapper = styled.div<{ visible: boolean }>`
  padding: 0 0 1rem !important;
  color: ${({ theme }) => theme.colors.snow};
  font-family: ${({ theme }) => theme.font};
  font-size: ${({ theme }) => theme.fontSizes.subtitle};
  line-height: 1.6rem;
  text-shadow: 1px 1px 10px #000, 1px 1px 10px #000;
  transform: ${({ visible }) =>
    visible ? 'translateX(0px)' : 'translateX(340px)'};
  transition: transform 300ms;
  font-s
`
