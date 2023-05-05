import styled from 'styled-components'

export const MapTopControlsWrapper = styled.div`
  position: absolute;
  top: 10px;
  left: 18px;
  display: flex;
  & button {
    font-variant: small-caps;
  }
  & button > em {
    font-variant: normal;
  }
`

export const MapTopControlsSection = styled.div`
  margin-right: 20px;
`

export const MapTopControlsSectionTitle = styled.div`
  font-style: italic;
  font-size: ${({ theme }) => theme.fontSizes.small};
`
