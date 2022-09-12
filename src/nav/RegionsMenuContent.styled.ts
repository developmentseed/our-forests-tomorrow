import styled from 'styled-components'

export const CloseButtonWrapper = styled.div`
  position: absolute;
  right: 1rem;
  top: 1rem;
  & > button {
    color: ${({ theme }) => theme.colors.white} !important;
  }
`

export const MenuColumns = styled.div`
  padding: 2rem 1rem 3rem 1rem;
  color: ${({ theme }) => theme.colors.light};
  columns: 8;
`

export const Country = styled.div`
  & > h3 {
    font-family: ${({ theme }) => theme.fonts.serif};
    color: ${({ theme }) => theme.colors.background};
    margin: 1rem 0 0.3rem 0;
  }
  &:first-child > h3 {
    margin: 0 0 0.3rem 0;
  }
`
export const RegionButton = styled.li`
  font-size: ${({ theme }) => theme.fontSizes.small};
  line-height: 0.8rem;
  cursor: pointer;
`
