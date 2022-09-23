import { Fragment, ReactNode, useState } from 'react'
import {
  useFloating,
  useClick,
  useDismiss,
  useInteractions,
  flip,
  shift,
} from '@floating-ui/react-dom-interactions'
import Dropdown from './Dropdown'

export type Item = {
  label: string
}

export type InlineDropdownProps = {
  children: ReactNode
  items: { label?: string }[]
}

function InlineDropdown({ children, items }: InlineDropdownProps) {
  return (
    <Dropdown
      button={(reference: any, getReferenceProps: any) => (
        <span>
          {items
            .slice(0, 3)
            .map((d) => d.label)
            .join(', ')}{' '}
          <button ref={reference} {...getReferenceProps()}>
            +
          </button>
        </span>
      )}
    >
      {children}
    </Dropdown>
  )
}

export default InlineDropdown
