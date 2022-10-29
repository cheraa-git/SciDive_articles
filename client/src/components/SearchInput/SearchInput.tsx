import { Button, Checkbox, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { articleSearch } from '../../store/actions/ArticleActions'
import { RootState } from '../../store/rootReducer'
import { Search } from '../../types/interfaces'
import { Dropdown } from '../UI/Dropdown/Dropdown'
import './SearchInput.sass'

export const SearchInput: React.FC = () => {
  const dispatch = useDispatch()

  const { search } = useSelector((state: RootState) => state.article)
  const [searchInput, setSearchInput] = useState('')
  const [title, setTitle] = useState(true)
  const [tags, setTags] = useState(false)
  const [content, setContent] = useState(false)
  const [settingsToggle, setSettingsToggle] = useState<HTMLElement | null>(null)

  const searchHandler = () => {
    const payload: Search = {
      request: searchInput,
      title,
      tags,
      content,
    }
    dispatch(articleSearch(payload))
  }
  const cancelSearch = () => {
    setSearchInput('')
    dispatch(articleSearch())
  }

  return (
    <div className="search">
      <i
        className="bi bi-sliders "
        onClick={({ currentTarget }) => setSettingsToggle(prev => (prev ? null : currentTarget))}
      />
      <Dropdown anchorEl={settingsToggle} onClose={() => setSettingsToggle(null)}>
        <div className="settings">
          <h5 className="settings__title">
            Параметры поиска
            <Tooltip title={'Выберете поля, по которым будет производиться поиск'} placement="right">
              <i className="bi bi-info-circle my-auto fs-6"></i>
            </Tooltip>
          </h5>

          <div className="settings__filter-item">
            <p>Название статьи</p>
            <Checkbox size="small" checked={title} onChange={() => setTitle(prev => !prev)} />
          </div>

          <div className="settings__filter-item">
            <p>Ключевые слова</p>
            <Checkbox size="small" checked={tags} onChange={() => setTags(prev => !prev)} />
          </div>

          <div className="settings__filter-item">
            <p>Содержание</p>
            <Checkbox size="small" checked={content} onChange={() => setContent(prev => !prev)} />
          </div>

          <div className="settings__filter-item">
            <p>Пользователи</p>
            <Checkbox size="small" disabled />
          </div>
        </div>
      </Dropdown>
      <input
        className="form-control"
        value={searchInput}
        onChange={e => setSearchInput(e.target.value)}
        placeholder="Поиск статей"
        aria-label="Search"
      />
      {search.request ? (
        <i className="bi bi-x-lg" onClick={cancelSearch} />
      ) : (
        <i className="bi bi-search" onClick={searchHandler} />
      )}
    </div>
  )
}
