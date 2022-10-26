import React, { ReactElement, ReactNode, Ref, RefObject, useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import './Dropdown.sass'

interface DropdownProps {
  anchorEl: HTMLElement | null
  onClose: () => void
  dir?: 'left' | 'right' | 'top' | 'bottom'
  mouseEvent?: boolean
  posit?: 'start' | 'center' | 'end'
}

export const Dropdown: React.FC<DropdownProps> = ({
  anchorEl,
  onClose,
  children,
  dir = 'bottom',
  mouseEvent = false,
  posit = 'start',
}) => {
  const [toggle, setToggle] = useState(false)
  const divV = document.getElementsByClassName('dropdown_main')[0]
  const [pos, setPos] = useState(anchorEl)
  const transitionRef = useRef(null)

  useEffect(() => {
    if (!anchorEl) {
      setTimeout(() => setPos(null), 200)
    } else {
      setPos(anchorEl)
    }
  }, [anchorEl])

  const positionHandler = () => {
    if (pos) {
      const { offsetLeft: x, offsetTop: y, offsetHeight: h, offsetWidth: w } = pos

      let result = { left: 0, top: 0 }
      if (dir === 'bottom') {
        result = { left: x, top: y + h }
        return result
      }
    }
  }

  const listnerHandler = (e: MouseEvent) => {
    if (anchorEl && transitionRef.current) {
      const isDivClick = e.composedPath().includes(transitionRef.current)
      const isAnchorClick = e.composedPath().includes(anchorEl)

      if (!isDivClick && !isAnchorClick) {
        onClose()
        document.removeEventListener('click', listnerHandler)
      }
    }
  }

  useEffect(() => {
    if (anchorEl) {
      document.addEventListener('click', listnerHandler)
    }
  }, [anchorEl])

  return (
    <CSSTransition
      in={Boolean(anchorEl)}
      timeout={200}
      classNames={`dropdown_${dir}`}
      nodeRef={transitionRef}
      mountOnEnter
      unmountOnExit
    >
      <div className="dropdown_content" style={positionHandler()} ref={transitionRef}>
        {children}
      </div>
    </CSSTransition>
  )
}
