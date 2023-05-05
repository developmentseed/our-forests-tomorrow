import styled from 'styled-components'
export const Species = styled.div`
  padding: 0 0 0 3rem;
  color: ${({ theme }) => theme.colors.forestDark};
  display: flex;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    padding: 0;
  }
`

export const SpeciesButton = styled.button`
  font-variant: small-caps;
  margin: 1.5rem;
  width: 80px;
  &:disabled {
    opacity: 0.5;
  }

  & > img {
    border-radius: 50%;
    width: 90%;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    text-align: left;
    margin: 0;
    width: auto;
    display: flex;
    align-items: center;
    & > img {
      border-radius: 50%;
      width: 40px;
      margin-right: .5rem;
    }
  }

}
`
