import { Fragment, ReactNode, useState } from 'react'
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

export type DropdownProps = {
  children: ReactNode
  button: (reference: any, getReferenceProps: any) => ReactNode
}

function Dropdown({ children, button }: DropdownProps) {
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
      {button(reference, getReferenceProps)}
      {open && (
        <div
          ref={floating}
          style={{
            zIndex: 2,
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          }}
          {...getFloatingProps()}
        >
          {children}
        </div>
      )}
    </Fragment>
  )
}

export default Dropdown
