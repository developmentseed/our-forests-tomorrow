import styled from 'styled-components'

interface MenuContentsProps {
  readonly strategy: string
}

export const MenuContents = styled.div<MenuContentsProps>`
  position: ${({ strategy }) => strategy};
  top: ${({ theme }) => theme.layout.navHeight};
  left: 0;
  width: 100%;
  background: black;
`

export const MenuColumns = styled.div`
  columns: 3;

  & > ul {
    list-style-type: none;
  }
`
