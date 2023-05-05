import styled from 'styled-components'

export const PageTimeseriesItem = styled.div`
  display: flex;
  margin: 0;
  padding: 0;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }

  cursor: pointer;
  & > label {
    cursor: pointer;
    font-size: ${({ theme }) => theme.fontSizes.small};
    min-width: 220px;
    max-width: 220px;
    text-align: right;
    margin-right: 1rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      text-align: left;
      margin-top: 10px;
    }
  }
`
