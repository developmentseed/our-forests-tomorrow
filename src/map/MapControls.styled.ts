import styled from 'styled-components'

export const MapControlsWrapper = styled.div`
  position: absolute;
  width: 320px;
  bottom: 40px;
  right: 10px;
  display: flex;
  flex-direction: column;

  & > * {
    border-radius: 4px;
    padding: 0.8rem;
  }
`
