import {
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react-dom-interactions'
import { Fragment, ReactNode, useCallback, useState } from 'react'
import { MenuButton, MenuContents } from './Menu.styled'

export type MenuProps = {
  label: string
  children: (props: any) => ReactNode
}

function Menu({ label, children }: MenuProps) {
  const [open, setOpen] = useState<boolean>(false)
  const { reference, floating, strategy, context } = useFloating({
    open,
    onOpenChange: setOpen,
  })

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context),
  ])

  const closeMenuCallback = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <Fragment>
      <MenuButton ref={reference} {...getReferenceProps()}>
        {label}
      </MenuButton>
      {open && (
        <MenuContents
          ref={floating}
          strategy={strategy}
          {...getFloatingProps()}
        >
          {children(closeMenuCallback)}
        </MenuContents>
      )}
    </Fragment>
  )
}

export default Menu
