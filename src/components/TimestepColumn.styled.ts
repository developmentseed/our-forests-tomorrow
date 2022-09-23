import styled from 'styled-components'

export const TimestepColumn = styled.div`
  position: absolute;
  border: 0.1px solid rgb(0, 0, 0, 0.1);
  border-top-width: 0;
  border-bottom-width: 0;
  display: flex;
  align-items: end;
  padding: 0;
  & > * {
    width: 100%;
    text-align: center;
    font-size: ${({ theme }) => theme.fontSizes.small};
  }
`
