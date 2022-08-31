import styled from 'styled-components'

export const MenuButton = styled.button`
  text-transform: uppercase;
  font-size: 1rem;
  font-weight: bold;
`

interface MenuContentsProps {
  readonly strategy: string
}

export const MenuContents = styled.div<MenuContentsProps>`
  position: ${({ strategy }) => strategy};
  top: ${({ theme }) => theme.layout.navHeight};
  left: 0;
  width: 100%;
  background: black;
  z-index: 99;
`

export const MenuColumns = styled.div`
  color: ${({ theme }) => theme.colors.light};
  display: flex;
  & > ul {
    columns: 4;
    list-style-type: none;
  }
`