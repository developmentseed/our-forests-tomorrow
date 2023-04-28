import styled from 'styled-components'
export const MenuColumns = styled.div`
  padding: 2rem 1rem 3rem 1rem;
  color: ${({ theme }) => theme.colors.forestDark};
  display: flex;

  justify-content: space-between;
  & > ul {
    columns: 4;
  }
`

export const Aside = styled.aside`
  font-family: ${({ theme }) => theme.font};
  font-size: 1.5rem;
  text-transform: uppercase;
  max-width: 35%;
  margin-right: 2rem;

  & > p {
    display: inline;
    font-variant-numeric: oldstyle-nums;
  }


`

interface SpeciesButtonProps {
  readonly color: string
}

export const SpeciesButton = styled.button<SpeciesButtonProps>`
  display: block;
  padding: 0 0 0 0.4rem;
  border-left: 4px solid ${({ color }) => color};
  text-align: left;
  text-transform: capitalize;
  height: 34px;
  font-size: ${({ theme }) => theme.fontSizes.small};
  line-height: 0.8rem;

  &:disabled {
    opacity: 0.3;
  }

  & > b {
    display: block;
    font-weight: normal;
    /* backdrop-filter: blur(10px); */
  }
}
`
