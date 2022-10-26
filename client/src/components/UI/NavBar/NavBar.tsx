import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import logo from '../../../asserts/logotip.png'
import { logoutUser } from '../../../store/actions/AuthActions'
import { RootState } from '../../../store/rootReducer'
import defaultAvatar from '../../../asserts/default_avatar.png'
import { STATIC } from '../../../config'
import { Dropdown } from '../Dropdown/Dropdown'
import { MenuItem } from '@mui/material'
import { articleSearch } from '../../../store/actions/ArticleActions'
import './NavBar.sass'
import { Search } from '../../../types/interfaces'

export const NavBar: React.FC = () => {
  const dispatch = useDispatch()
  const { isAuth } = useSelector((state: RootState) => state.auth)
  const { search } = useSelector((state: RootState) => state.article)
  const avatar = localStorage.getItem('userAvatar') ? STATIC + localStorage.getItem('userAvatar') : defaultAvatar
  const [searchInput, setSearchInput] = useState('')
  const [searchTitle, setSearchTitle] = useState(true)
  const [searchTags, setSearchTags] = useState(false)
  const [searchContent, setSearchContent] = useState(false)

  const [searchSettingsToggle, setSearchSettingsToggle] = useState<HTMLElement | null>(null)
  const [profileImgToggle, setProfileImgToggle] = useState<HTMLElement | null>(null)

  const searchHandler = () => {
    const payload: Search = {
      request: searchInput,
      title: searchTitle,
      tags: searchTags,
      content: searchContent,
    }
    dispatch(articleSearch(payload))
  }
  const cancelSearch = () => {
    setSearchInput('')
    dispatch(articleSearch())
  }

  const dropdownLinks = isAuth ? (
    <>
      <div className="d-flex ">
        <NavLink to={`/profile/${localStorage.getItem('userName')}`} className="lead mb-0 text-decoration-none">
          @{localStorage.getItem('userName')}
          <img src={avatar} className="rounded ms-2" height={30} alt="" />
        </NavLink>
      </div>

      <hr className="dropdown-divider" />

      <MenuItem onClick={() => dispatch(logoutUser())}>Выход</MenuItem>
    </>
  ) : (
    <>
      <li>
        <NavLink className="dropdown-item rounded" to="/auth/login">
          Вход
        </NavLink>
      </li>
      <hr className="dropdown-divider" />
      <li>
        <NavLink className="dropdown-item rounded" to="/auth/signup">
          Регистрация
        </NavLink>
      </li>
    </>
  )
  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark p-0">
      <div className="container-fluid">
        <a className="navbar-brand lead" href="/">
          <img src={logo} alt="Логотип" width="30" height="24" className="d-inline-block align-text-top" /> Статьи
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse fs-5" id="navbarNav">
          <ul className="navbar-nav p-0">
            <li className="nav-item">
              <NavLink className="nav-link" aria-current="page" to="/">
                Главная
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={`nav-link ${document.location.pathname === '/create_article' && 'active'}`}
                to="/create_article"
              >
                Создать статью
              </NavLink>
            </li>
          </ul>

          <div className="d-flex ms-auto">
            <div className="settings-input">
              
              <i
                className="bi bi-sliders "
                onClick={e => setSearchSettingsToggle(prev => (prev ? null : e.currentTarget))}
              />
              <Dropdown anchorEl={searchSettingsToggle} onClose={() => setSearchSettingsToggle(null)}>
                <div>
                  <p className="asdf">asdf1</p>
                  <p className="asdf2">asdf2</p>
                  <p className="asdf3">asdf3</p>
                  <i className="bi bi-sliders" />
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
          </div>
          <ul className="navbar-nav ms-auto">
            <div className="me-5">
              <img
                src={avatar}
                className="img-fluid rounded"
                alt=""
                width={30}
                id="navbar__profile-img"
                onClick={e => setProfileImgToggle(prev => (prev ? null : e.currentTarget))}
              />
              <Dropdown anchorEl={profileImgToggle} onClose={() => setProfileImgToggle(null)}>
                {dropdownLinks}
              </Dropdown>
            </div>
          </ul>
        </div>
      </div>
    </nav>
  )
}
