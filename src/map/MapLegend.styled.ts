import styled from 'styled-components'

export const MapLegendsWrapper = styled.ul<{ visible: boolean }>`
  margin: 0.5rem 0 0;
  background: ${({ theme }) => theme.colors.light};
  font-size: ${({ theme }) => theme.fontSizes.small};
  transform: ${({ visible }) =>
    visible ? 'translateX(0px)' : 'translateX(340px)'};
  transition: transform 1000ms;
`
export const LegendItem = styled.li<{
  disabled?: boolean
}>`
  text-transform: capitalize;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  line-height: 1.2rem;

  & > svg {
    margin-right: 0.4rem;
  }
`
