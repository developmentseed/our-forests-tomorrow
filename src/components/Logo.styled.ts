import styled from 'styled-components'

export const Logo = styled.h1`
  font-family: ${({ theme }) => theme.font};
  font-style: italic;
  font-weight: 400;
  font-size: 1.4rem;
  line-height: 1.3rem;
  margin-right: 2rem;
  transform: translateY(-3px);

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1rem;
    margin-right: 1.3rem;
  }
`
