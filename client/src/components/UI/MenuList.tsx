import React from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

interface MenuListProps {
  anchorEl: Element | null
  items: {
    label: string
    onClick: () => any
  }[]
  setAnchorEl: (x: null) => void
}

const MenuList: React.FC<MenuListProps> = ({ anchorEl, items, setAnchorEl }) => {
  // ancorEl - расположение меню. Значение появляется при нажатии кнопки.
  //    В параметр кнопки onClick нужно передать функцию: (event) => setAncorEl(event.currentTarget)

  // items - массив с массивами: [[label_1, function_1], [label_2, function_2]]

  // onClose - функция, которая обнуляет значение ancorEl: setAncorEl(null)
  
  return (
    <Menu  anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
      {items.map((el, index) => (
        <MenuItem key={index} onClick={el.onClick}>
          {el.label}
        </MenuItem>
      ))}
    </Menu>
  )
}

export default MenuList
