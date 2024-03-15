import styled, { css } from 'styled-components'

export const NavWrapper = styled.header<{
  visible: boolean
}>`
  position: ${({ visible }) => (visible ? 'sticky' : 'absolute')};
  top: ${({ visible, theme }) => (visible ? 0 : '-70px')};
  background-color: ${({ theme }) => theme.colors.forestDark};
  color: ${({ theme }) => theme.colors.pebbleLight};
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 4;
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

export const SandwichMenu = styled.button`
  display: none;
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.pebbleLight};
  font-size: 1.5rem;
  padding: 0;
  cursor: pointer;
  transform: translateY(-3px);

  &:after {
    content: '☰';
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: block;
  }
`

export const NavButtons = styled.div<{ visible?: boolean }>`
  height: 100%;
  display: flex;

  & > nav {
    display: flex;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: ${({ visible }) => (visible ? 'flex' : 'none')};
    position: absolute;
    top: 48px;
    right: 0;
    width: 100%;

    & > nav {
      flex-direction: column;
      width: 100%;
    }

    & button {
      min-height: ${({ theme }) => theme.layout.navHeight};
      background-color: ${({ theme }) => theme.colors.forestDark};
    }
  }
`

const navItemStyle = css`
  height: 100%;

  color: ${({ theme }) => theme.colors.pebbleLight};
  text-transform: uppercase;
  font-size: 0.8rem;

  padding: 0 0.3rem;
  text-decoration: none;
  line-height: 48px;
`

export const NavButton = styled.button<{
  visible?: boolean
  selected?: boolean
}>`
  ${navItemStyle}

  opacity: ${({ visible }) =>
    visible === true || visible === undefined ? 1 : 0};
  transition: opacity 300ms;
  padding: 0 0.3rem;

  border-bottom-color: ${({ theme }) => theme.colors.leaf};
  border-bottom-style: solid;
  border-bottom-width: ${({ selected }) => (selected ? '3px' : 0)};
`

export const NavLink = styled.a`
  ${navItemStyle}
`