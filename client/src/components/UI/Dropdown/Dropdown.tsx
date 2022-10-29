import React, { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import './Dropdown.sass'

interface DropdownProps {
  anchorEl: HTMLElement | null
  onClose: () => void
  dir?: 'left' | 'right' | 'top' | 'bottom'
  align?: 'start' | 'center' | 'end'
  className?: string
}

export const Dropdown: React.FC<DropdownProps> = ({
  anchorEl,
  onClose,
  children,
  dir = 'bottom',
  align = 'start',
  className,
}) => {
  const [localAnchor, setLocalAnchor] = useState(anchorEl)
  const transitionRef = useRef<HTMLDivElement>(null)

  const positionHandler = () => {
    let result = { left: 0, top: 0 }
    if (localAnchor && transitionRef.current) {
      const { offsetLeft: posX, offsetTop: posY, offsetHeight: posH, offsetWidth: posW } = localAnchor
      const { offsetLeft: divX, offsetTop: divY, offsetHeight: divH, offsetWidth: divW } = transitionRef.current

      if (align === 'start') {
        result = { left: posX, top: posY + posH }
      } else if (align === 'end') {
        result = { left: posX - divW + posW, top: posY + posH }
      } else if (align === 'center') {
        result = { left: posX + posW / 2 - divW / 2, top: posY + posH }
      }
      return result
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
    if (!anchorEl) {
      setTimeout(() => setLocalAnchor(null), 200)
    } else {
      setLocalAnchor(anchorEl)
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
      <div className={`dropdown_content ${className && className} `} style={positionHandler()} ref={transitionRef}>
        {children}
      </div>
    </CSSTransition>
  )
}
