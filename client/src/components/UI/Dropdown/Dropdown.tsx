import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import './Dropdown.sass'

interface DropdownProps {
  dropHeader: ReactElement
  dir?: 'left' | 'right' | 'top' | 'bottom'
  mouseEvent?: boolean
  pos?: 'start' | 'center' | 'end'
}

export const Dropdown: React.FC<DropdownProps> = ({
  dropHeader,
  children,
  dir = 'bottom',
  mouseEvent = false,
  pos = 'start',
}) => {
  const [toggle, setToggle] = useState(false)
  const divV = document.getElementsByClassName('dropdown_main')[0]
  // const mainRef = useRef(null).current

  // console.log('divV', divV)
  // console.log('main', mainRef)

  const listnerHandler = (e: MouseEvent) => {
    if (divV) {
      const withinBoundaries = e.composedPath().includes(divV)
      if (!withinBoundaries) {
        setToggle(false)
        document.removeEventListener('click', listnerHandler)
      }
    }
  }

  document.addEventListener('click', listnerHandler)

  return (
    <div className="dropdown_main" onMouseOver={mouseEvent ? () => setToggle(true) : () => {}}>
      <div onClick={() => setToggle((prev) => !prev)}>{dropHeader}</div>
      <div style={{ marginRight: '100px' }}>
        <CSSTransition in={toggle} timeout={200} classNames={`dropdown_${dir}`} mountOnEnter unmountOnExit>
          <div className="dropdown_content">{children}</div>
        </CSSTransition>
      </div>
    </div>
  )
}
