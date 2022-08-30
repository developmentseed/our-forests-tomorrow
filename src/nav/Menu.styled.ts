import styled from 'styled-components'

interface MenuContentsProps {
  readonly strategy: string
}

export const MenuContents = styled.div<MenuContentsProps>`
  position: ${({ strategy }) => strategy};
  top: 0;
  left: 0;
`
