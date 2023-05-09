import styled from 'styled-components'

export const ButtonBar = styled.div`
  display: flex;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.25);
`

export const Button = styled.button<{ active?: boolean }>`
  background: ${({ theme, active }) =>
    active ? theme.colors.forestDark : theme.colors.snow};
  color: ${({ theme, active }) =>
    active ? theme.colors.snow : theme.colors.forestDark};
  border: 1px solid ${({ theme }) => theme.colors.forestDark};
  padding: 12px 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 4px 7px;
  }

  &:first-child {
    border-radius: 3px 0px 0px 3px;
  }

  &:last-child {
    border-radius: 0px 3px 3px 0px;
  }

  &:not(:last-child) {
    border-right: none;
  }
`
