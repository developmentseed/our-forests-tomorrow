import styled from 'styled-components'

export const MapTimeseriesWrapper = styled.nav<{ visible: boolean }>`
  background-color: ${({ theme }) => theme.colors.white};
  position: relative;
  padding-bottom: 50px;
  transform: ${({ visible }) =>
    visible ? 'translateX(0px)' : 'translateX(340px)'};
  transition: transform 300ms;
`

export const TimestepNav = styled.nav`
  position: absolute;
  top: 1.5rem;
`
