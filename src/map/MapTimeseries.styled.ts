import styled from 'styled-components'

export const MapTimeseriesWrapper = styled.nav<{ visible: boolean }>`
  background-color: ${({ theme }) => theme.colors.snow};
  position: relative;
  padding-bottom: 50px;
  transform: ${({ visible }) =>
    visible ? 'translateX(0px)' : 'translateX(340px)'};
  transition: transform 300ms;
`

