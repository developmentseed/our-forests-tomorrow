import styled from 'styled-components'

export const MapWrapper = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.layout.navHeight};
  height: calc(100vh - ${({ theme }) => theme.layout.navHeight})};
  width: 100%;
  transition: height 300ms;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: ${({theme}) => theme.mapRevealHeight};

  }
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
