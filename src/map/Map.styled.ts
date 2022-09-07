import styled from 'styled-components'

export const MapWrapper = styled.div<{ fixed: boolean }>`
  position: ${({ fixed }) => (fixed ? 'fixed' : 'relative')};
  top: ${({ fixed, theme }) => (fixed ? theme.layout.navHeight : 0)};
  height: ${({ fixed }) => (fixed ? 'calc(100vh - 70px)' : '60vh')};
  width: 100%;
  background-color: ${({ theme }) => theme.colors.dark};
  transition: height 300ms;
`

export const MapZoom = styled.div`
  position: absolute;
  z-index: 1;
  bottom: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;

  & > button {
    width: 30px;
    height: 30px;
    border-radius: 99px;
    background: ${({ theme }) => theme.colors.light};
    color: ${({ theme }) => theme.colors.dark};
    border: 1px solid ${({ theme }) => theme.colors.dark};
    font-size: 1rem;
    font-weight: bold;
  }

  & > button:first-child {
    margin-bottom: 5px;
  }
`
