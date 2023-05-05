import {
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react-dom-interactions'
import { Fragment, ReactNode, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { MenuContents } from './Menu.styled'
import { NavButton } from './Nav.styled'

export type MenuProps = {
  label: string
  visible: boolean
  children: (props: any) => ReactNode
}

function Menu({ label, visible, children }: MenuProps) {
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
      <NavButton
        visible={visible}
        selected={open}
        ref={reference}
        {...getReferenceProps()}
      >
        {label}
      </NavButton>
      {open &&
        createPortal(
          <MenuContents
            ref={floating}
            strategy={strategy}
            {...getFloatingProps()}
          >
            {children(closeMenuCallback)}
          </MenuContents>,
          document.getElementById('menuPortal') as HTMLElement
        )}
    </Fragment>
  )
}

export default Menu
