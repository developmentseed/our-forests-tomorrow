import styled from 'styled-components'

export const PageTimeseriesItem = styled.div`
  display: flex;
  margin: 0;
  padding: 0;
  align-items: center;

  cursor: pointer;
  & > label {
    cursor: pointer;
    font-size: ${({ theme }) => theme.fontSizes.small};
    min-width: 220px;
    max-width: 220px;
    text-align: right;
    margin-right: 1rem;
  }
`
