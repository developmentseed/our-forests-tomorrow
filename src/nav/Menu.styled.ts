import styled from 'styled-components'

interface MenuContentsProps {
  readonly strategy?: string
}

export const MenuContents = styled.div<MenuContentsProps>`
  position: ${({ strategy }) => strategy};

  left: 0;
  width: 100%;
  background: ${({ theme }) => theme.colors.pebbleLight};
  z-index: 99;
`

export const CloseButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 10px 18px;
`

export const MenuWrapper = styled.div`
  max-width: ${({ theme }) => theme.breakpoints.laptop};
  margin: 0 auto 5rem;
  display: flex;
  padding: 0 1rem;
`

export const MenuTools = styled.div`
  color: ${({ theme }) => theme.colors.forestDark};

  & label {
    display: block;
    font-weight: bold;
    font-size: ${({ theme }) => theme.fontSizes.small};
    margin-right: 1rem;
  }

  & > * {
    margin-bottom: 2rem;
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

export const SortByButton = styled.button`
  width: 250px;
  background: ${({ theme }) => theme.colors.snow};
  color: ${({ theme }) => theme.colors.forestDark};
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.small};
  padding: 0.6rem 2rem 0.6em 1rem;
  border-radius: 99px;
  position: relative;

  &::after {
    position: absolute;
    right: 0.8rem;
    bottom: 0.2rem;
    content: '↡';
    font-size: 1.4rem;
    font-weight: normal;
  }
`

export const SortByList = styled.ul`
  width: 230px;
  background: ${({ theme }) => theme.colors.snow};
  color: ${({ theme }) => theme.colors.forestDark};
  font-size: ${({ theme }) => theme.fontSizes.small};
  text-align: center;
  z-index: 2;
  cursor: pointer;

  & > li {
    border: 1px solid ${({ theme }) => theme.colors.forestDark};
  }
`

export const Search = styled.input`
  width: 230px;
  border: 0;
  background: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.forestDark};
  color: ${({ theme }) => theme.colors.forestDark};
  font-size: ${({ theme }) => theme.fontSizes.small};

  &::placeholder {
    font-style: italic;
    color: ${({ theme }) => theme.colors.forestDark};
    opacity: 0.5;
  }

  &:focus {
    outline: none;
    border-bottom-width: 2px;
  }
`
