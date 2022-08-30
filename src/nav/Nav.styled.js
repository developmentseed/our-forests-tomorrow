import styled from 'styled-components'

export const NavWrapper = styled.header`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.colors.dark};
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0.3rem;

  & > section {
    display: flex;
  }

  & > section > nav {
    margin-left: 1rem;
  }

  & h1 {
    font-size: 1.2rem;
  }
`
