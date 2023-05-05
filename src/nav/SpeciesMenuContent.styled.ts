import styled from 'styled-components'
export const Species = styled.div`
  padding: 0 0 0 3rem;
  color: ${({ theme }) => theme.colors.forestDark};
  display: flex;
  flex-wrap: wrap;
`

export const SpeciesButton = styled.button`
  width: 80px;
  font-variant: small-caps;
  margin: 1.5rem;
  
  &:disabled {
    opacity: 0.5;
  }
}
`
