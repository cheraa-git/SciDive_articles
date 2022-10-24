import { Button, ButtonGroup, ButtonProps } from '@mui/material'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store/rootReducer'

export const SearchPage: React.FC = () => {
  const buttonConfig: ButtonProps = { variant: 'contained', size: 'small' }
  const [searchType, setSearchType] = useState<'title' | 'content' | 'user'>('title')
  const { articles, currentCategory, loading } = useSelector((state: RootState) => state.article)

  const buttonConf = (type: 'title' | 'content' | 'user'): ButtonProps => {
    const result: ButtonProps = {
      variant: 'text',
      size: 'small',
      color: 'inherit',
      onClick: () => setSearchType(type),
    }
    if (type === searchType) result.color = 'primary'
    else if (type === searchType) result.color = 'primary'
    else if (type === searchType) result.color = 'primary'
    return result
  }

  return (
    <div className="container bg-translucent-light">
      <div className="container">
        <div className="d-flex">
          <input className="form-control me-content " />
          <Button>найти</Button>
        </div>

        <div className="d-flex">
          <ButtonGroup className="mx-auto" variant="text">
            <Button {...buttonConf('title')}>Название</Button>
            <Button {...buttonConf('content')}>Содержание</Button>
            <Button {...buttonConf('user')}>Пользователь</Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  )
}
