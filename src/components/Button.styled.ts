import styled from 'styled-components'

type ButtonProps = {
  size?: 'small' | 'normal'
}

export const Button = styled.button<ButtonProps>`
  border: 1px solid ${({ theme }) => theme.colors.dark};
  border-radius: 99px;
  width: 34px;
  height: 34px;

  &::after {
    font-size: 1.8rem;
    line-height: 1.7rem;
  }
`

export const CloseButton = styled(Button)`
  &::after {
    content: '⤫';
  }
`

export const InfoButton = styled(Button)`
  &::after {
    content: 'i';
  }
`

export const TimestepButton = styled.button<{ selected: boolean }>`
  opacity: ${({ selected }) => (selected ? 1 : 0.4)};
  border-width: ${({ selected }) => (selected ? '1px' : 0)};
  border-color: ${({ theme }) => theme.colors.darkgreen};
  border-style: solid;
  border-radius: 5px;
  padding: 4px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.darkgreen};
  font-weight: bold;
`
