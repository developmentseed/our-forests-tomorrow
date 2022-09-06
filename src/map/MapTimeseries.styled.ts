import styled from 'styled-components'

export const MapTimeseriesWrapper = styled.nav`
  background-color: ${({ theme }) => theme.colors.white};
  position: relative;
  padding-bottom: 50px;
`

export const TimestepNav = styled.nav`
  position: absolute;
  top: 1rem;
`

export const TimestepButton = styled.button<{ selected: boolean }>`
  position: absolute;
  border: 0.1px dashed rgb(0, 0, 0, 0.2);
  display: flex;
  align-items: end;
  padding: 0;
  & > span {
    width: 100%;
    opacity: ${({ selected }) => (selected ? 1 : 0.4)};
    border-width: ${({ selected }) => (selected ? '1px' : 0)};
    border-color: ${({ theme }) => theme.colors.darkgreen};
    border-style: solid;
    border-radius: 5px;
    padding: 4px;
    background: ${({ theme }) => theme.colors.background};
    /* color: ${({ theme }) => theme.colors.darkgreen}; */
  }
`
