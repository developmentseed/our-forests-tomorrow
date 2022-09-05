import styled from 'styled-components'

export const MapLegendsWrapper = styled.ul`
  margin: 4px 0 0;
  background: ${({ theme }) => theme.colors.light};
  list-style-type: none;
  font-size: ${({ theme }) => theme.fontSizes.small};
`
export const LegendItem = styled.li<{
  color?: string
}>`
  text-transform: capitalize;
  opacity: ${({ color }) => (color ? 1 : 0.5)};
  line-height: 1.2rem;

  &::before {
    content: '⬢';
    font-size: 1rem;
    margin-right: 0.4rem;
    color: ${({ color, theme }) => color || theme.colors.dark};
    /* background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' height='100%' width='100%'><defs><pattern id='diagonalHatching' width='3' height='3' patternTransform='rotate(45 0 0)' patternUnits='userSpaceOnUse'><line x1='4' x2='4' y1='0' y2='10' style='stroke:red; stroke-width:5'/></pattern></defs><rect width='100%' height='100%' fill='url(%23diagonalHatching)'/></svg>"); */
  }
`
