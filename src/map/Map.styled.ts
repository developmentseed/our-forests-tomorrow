import styled from 'styled-components'

export const MapWrapper = styled.div<{ fixed: boolean }>`
  position: ${({ fixed }) => (fixed ? 'fixed' : 'relative')};
  top: ${({ fixed, theme }) => (fixed ? theme.layout.navHeight : 0)};
  height: ${({ fixed }) => (fixed ? 'calc(100vh - 70px)' : '70vh')};
  width: 100%;
  transition: height 300ms;
`

export const MapZoom = styled.div<{ visible: boolean }>`
  position: absolute;
  z-index: 1;
  bottom: 40px;
  left: 8px;
  display: flex;
  flex-direction: column;
  transform: ${({ visible }) =>
    visible ? 'translateX(0px)' : 'translateX(-50px)'};
  transition: transform 300ms;

  & > button {
    width: 34px;
    height: 34px;
    border-radius: 99px;
    background: ${({ theme }) => theme.colors.snow};
    color: ${({ theme }) => theme.colors.forestDark};
    border: 1px solid ${({ theme }) => theme.colors.forestDark};
    font-family: 'sans-serif';
    font-size: 1.2rem;
    font-weight: bold;
  }

  & > button:first-child {
    margin-bottom: 5px;
  }
`
