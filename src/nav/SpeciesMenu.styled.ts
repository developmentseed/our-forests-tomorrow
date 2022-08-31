import styled from 'styled-components'

export const SpeciesMenuTools = styled.div`
  height: ${({ theme }) => theme.layout.navHeight};
  display: flex;
  justify-content: right;
  align-items: center;
  background: ${({ theme }) => theme.colors.background};
  padding: 1rem;

  & > *:not(:last-child) {
    padding-right: 4rem;
  }
`

export const Aside = styled.aside`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 4rem;

  & > b {
    font-family: ${({ theme }) => theme.fonts.serifBold};
    display: block;
    font-size: 8rem;
  }
`

interface SpeciesButtonProps {
  readonly color: string
}

export const SpeciesButton = styled.button<SpeciesButtonProps>`
  border-left: 2px solid ${({ color }) => color};
  color: ${({ theme }) => theme.colors.light};
  text-align: left;
  text-transform: capitalize;
`
