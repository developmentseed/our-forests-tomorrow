import styled from 'styled-components'

export const MapWrapper = styled.div`
  position: relative;
  height: 60vh;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.dark};
`

export const MapZoom = styled.div`
  position: absolute;
  z-index: 1;
  bottom: 30px;
  left: 30px;
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
