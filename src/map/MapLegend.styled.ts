import styled from 'styled-components'
import { TimeStep } from '../types'

export const MapLegendsWrapper = styled.ul<{ timeStep: TimeStep }>`
  margin: 4px 0 0;
  background: ${({ theme }) => theme.colors.light};
  list-style-type: none;
  font-size: ${({ theme }) => theme.fontSizes.small};

  & > li:not(:first-child) {
    opacity: ${({ timeStep }) => (timeStep === '2005' ? 0.5 : 1)};
  }
`
