import styled from 'styled-components'

export const CloseButton = styled.button`
  text-decoration: underline;
  color: ${({ theme }) => theme.colors.pebbleDark};
  font-style: italic;
  
  &::after {
    font-style: normal;
    font-size: 1rem;
    line-height: 1.5rem;
    text-decoration: none;
    margin-left: 4px;
    content: '⤫';
  }
`