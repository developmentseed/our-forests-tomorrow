import styled from 'styled-components'

export const MapTimeseriesWrapper = styled.nav<{ visible: boolean }>`
  background-color: ${({ theme }) => theme.colors.white};
  position: relative;
  padding-bottom: 50px;
  transform: ${({ visible }) =>
    visible ? 'translateX(0px)' : 'translateX(300px)'};
  transition: transform 300ms;
`

export const TimestepNav = styled.nav`
  position: absolute;
  top: 1rem;
`

export const TimestepButtonWrapper = styled.button`
  position: absolute;
  border: 0.1px dashed rgb(0, 0, 0, 0.2);
  display: flex;
  align-items: end;
  padding: 0;
  & > button {
    width: 100%;
  }
`
