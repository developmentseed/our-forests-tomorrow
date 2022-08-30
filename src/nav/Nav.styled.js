import styled from 'styled-components'

export const NavWrapper = styled.header`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.colors.dark};
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0.3rem;
  z-index: 1;

  & > section {
    display: flex;
  }
`

export const NavHeader = styled.div`
  display: flex;
  & > nav {
    margin-left: 1rem;
  }

  & h1 {
    font-size: 1.2rem;
  }
`

export const NavButtons = styled.div`
  display: flex;
`
