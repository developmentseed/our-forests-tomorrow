import styled from 'styled-components'

interface MenuContentsProps {
  readonly strategy: string
}

export const MenuContents = styled.div<MenuContentsProps>`
  position: ${({ strategy }) => strategy};
  top: ${({ theme }) => theme.layout.navHeight};
  left: 0;
  width: 100%;
  background: ${({ theme }) => theme.colors.dark};
  z-index: 99;
`

export const MenuColumns = styled.div`
  padding: 2rem 4rem 3rem 2rem;
  color: ${({ theme }) => theme.colors.light};
  display: flex;

  justify-content: space-between;
  & > ul {
    columns: 4;
  }
`
