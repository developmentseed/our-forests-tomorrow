import styled from 'styled-components'

export const MapLegendsWrapper = styled.div<{ visible: boolean }>`
  margin: 0.5rem 0 0;
  background: ${({ theme }) => theme.colors.snow};
  font-size: ${({ theme }) => theme.fontSizes.small};
  transform: ${({ visible }) =>
    visible ? 'translateX(0px)' : 'translateX(340px)'};
  transition: transform 1000ms;
`
