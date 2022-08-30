import {
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react-dom-interactions'
import { Fragment, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MenuContents } from './Menu.styled'
// import {  } from './Menu.styled'

export type MenuProps = {
  label: string
  children: ReactNode
  // items: { label?: string }[]
}

function Menu({ children, label }: MenuProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState<boolean>(false)
  const { reference, floating, strategy, context } = useFloating({
    open,
    onOpenChange: setOpen,
  })

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context),
  ])

  return (
    <Fragment>
      <button ref={reference} {...getReferenceProps()}>
        {label}
      </button>
      {open && (
        <MenuContents
          ref={floating}
          strategy={strategy}
          {...getFloatingProps()}
        >
          {children}
        </MenuContents>
      )}
    </Fragment>
  )
}

export default Menu
