import { TextField, TextFieldProps } from '@mui/material'
import React from 'react'

interface test {
  q: string
}

type InputDataListProps = TextFieldProps & {
  data: string[]
  width?: string
  ref?: any
}

export const InputDataList: React.FC<InputDataListProps> = props => {
  const LIST_NAME = 'input-data-list-name'
  return (
    <>
      <TextField
        // changeable params
        variant="standard"
        // ref={props.ref}
        {...props}
        // unchangeable params
        style={{ width: props.width }}
        inputProps={{ list: LIST_NAME }}
      >
        {props.children}
      </TextField>

      <datalist id={LIST_NAME}>
        {props.data.map((item, index) => (
          <option value={item} key={index} />
        ))}
      </datalist>
    </>
  )
}
