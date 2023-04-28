import styled from 'styled-components'

export const NavWrapper = styled.header<{
  visible: boolean
}>`
  position: ${({ visible }) => (visible ? 'sticky' : 'absolute')};
  top: ${({ visible }) => (visible ? 0 : '-70px')};
  background-color: ${({ theme }) => theme.colors.forestDark};
  color: ${({ theme }) => theme.colors.pebbleLight};
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 3;
  height: ${({ theme }) => theme.layout.navHeight};
  padding: 0 1rem;
  transition: top 300ms;
`

export const NavHeader = styled.div`
  height: 100%;
  display: flex;
  align-items: center;

  & > nav {
    margin-left: 1rem;
  }
`

export const NavButtons = styled.div`
  height: 100%;
  display: flex;
`

export const NavButton = styled.button<{ visible?: boolean }>`
  height: 100%;
  color: ${({ theme }) => theme.colors.pebbleLight};
  text-transform: uppercase;
  font-size: 0.8rem;

  opacity: ${({ visible }) =>
    visible === true || visible === undefined ? 1 : 0};
  transition: opacity 300ms;
  padding: 0 0.3rem;
  border-bottom-color: ${({ theme }) => theme.colors.leaf};
  border-bottom-style: solid;
  border-bottom-width: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.leaf};
    border-bottom-width: 3px;
  }
`
