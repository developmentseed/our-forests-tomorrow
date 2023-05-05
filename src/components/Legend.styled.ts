import styled from 'styled-components'

export const LegendWrapper = styled.ul`
  list-style: none;
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
