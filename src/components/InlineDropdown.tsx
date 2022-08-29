import { Fragment, ReactNode, useCallback, useState } from 'react'
import {
  useFloating,
  useClick,
  useDismiss,
  useInteractions,
  flip,
  shift,
} from '@floating-ui/react-dom-interactions'

export type Item = {
  label: string
}

export type InlineDropdownProps = {
  children: ReactNode
  items: { label?: string }[]
}

function InlineDropdown({ children, items }: InlineDropdownProps) {
  const [open, setOpen] = useState<boolean>(false)

  const { x, y, reference, floating, strategy, context } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [flip(), shift()],
  })
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context),
  ])
  return (
    <Fragment>
      <span>
        {items
          .slice(0, 3)
          .map((d) => d.label)
          .join(', ')}{' '}
        <button ref={reference} {...getReferenceProps()}>
          +
        </button>
      </span>
      {open && (
        <div
          ref={floating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            background: 'black',
          }}
          {...getFloatingProps()}
        >
          {children}
          {/* {data.map((d) => (
            <li>{d[1].region?.label}</li>
          ))} */}
        </div>
      )}
    </Fragment>
  )
}

export default InlineDropdown
