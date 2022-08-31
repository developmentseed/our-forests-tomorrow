import styled from 'styled-components'

export const NavWrapper = styled.header`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.colors.light};
  color: ${({ theme }) => theme.colors.dark};
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
  height: ${({ theme }) => theme.layout.navHeight};
  padding: 1rem;
`

export const NavHeader = styled.div`
  display: flex;
  align-items: center;
  & > h1 {
    text-transform: uppercase;
    font-size: 1.4rem;
    font-weight: normal;
    line-height: 1.3rem;
    margin-right: 2rem;

    & > b {
      display: block;
    }
  }
  & > nav {
    margin-left: 1rem;

    & > button {
      text-transform: uppercase;
      font-size: 1rem;
      font-weight: bold;
    }
  }
`

export const NavButtons = styled.div`
  display: flex;
`
