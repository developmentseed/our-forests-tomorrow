import styled from 'styled-components'

export const NavWrapper = styled.header<{
  visible: boolean
}>`
  position: ${({ visible }) => (visible ? 'sticky' : 'absolute')};
  top: ${({ visible }) => (visible ? 0 : '-70px')};
  background-color: ${({ theme }) => theme.colors.light};
  color: ${({ theme }) => theme.colors.dark};
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 3;
  height: ${({ theme }) => theme.layout.navHeight};
  padding: 1rem;
  transition: top 300ms;
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
  }
`

export const NavButtons = styled.div`
  display: flex;
`

export const NavButton = styled.button`
  color: ${({ theme }) => theme.colors.dark};
  text-transform: uppercase;
  font-size: 0.8rem;
  font-weight: bold;
`
