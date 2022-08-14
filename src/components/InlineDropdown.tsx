import { Fragment, ReactNode, useCallback, useState } from 'react'
import {
  useFloating,
  useClick,
  useDismiss,
  useInteractions,
} from '@floating-ui/react-dom-interactions'

export type Item = {
  label: string
}

export type InlineDropdownProps = {
  // children: ReactNode
  data: string[]
}

function InlineDropdown({ data }: InlineDropdownProps) {
  const [open, setOpen] = useState<boolean>(false)

  const { x, y, reference, floating, strategy, context } = useFloating({
    open,
    onOpenChange: setOpen,
  })
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context),
  ])
  return (
    <Fragment>
      <span>
        {data.slice(0, 3).join(', ')}{' '}
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
          {data.map((d) => (
            <li>{d}</li>
          ))}
        </div>
      )}
    </Fragment>
  )
}

export default InlineDropdown
