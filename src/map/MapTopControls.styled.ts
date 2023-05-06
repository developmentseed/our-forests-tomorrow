import styled from 'styled-components'

export const MapTopControlsWrapper = styled.div<{ visible?: boolean }>`
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 2s ease-in-out;
  position: absolute;
  top: 10px;
  left: 18px;
  display: flex;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    top: 2px;
  }

  & button {
    font-variant: small-caps;
  }
  & button > em {
    font-variant: normal;
    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      display: none;
    }
  }
`

export const MapTopControlsSection = styled.div`
  margin-right: 20px;
`

export const MapTopControlsSectionTitle = styled.div`
  font-style: italic;
  font-size: ${({ theme }) => theme.fontSizes.small};
`
