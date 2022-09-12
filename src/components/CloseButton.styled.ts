import styled from 'styled-components'

export const CloseButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.dark};
  border-radius: 99px;
  width: 34px;
  height: 34px;
  &::after {
    content: '⤫';
    font-size: 1.8rem;
    line-height: 1.7rem;
  }
`
