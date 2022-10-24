import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import logo from '../../asserts/logotip.png'
import { logoutUser } from '../../store/actions/AuthActions'
import { RootState } from '../../store/rootReducer'
import defaultAvatar from '../../asserts/default_avatar.png'
import { STATIC } from '../../config'
import { Dropdown } from './Dropdown/Dropdown'
import { Button, MenuItem } from '@mui/material'
import { articleSearch } from '../../store/actions/ArticleActions'

export const NavBar: React.FC = () => {
  const dispatch = useDispatch()
  const { isAuth } = useSelector((state: RootState) => state.auth)
  const avatar = localStorage.getItem('userAvatar') ? STATIC + localStorage.getItem('userAvatar') : defaultAvatar
  const [searchInput, setSearchInput] = useState('')

  const searchHandler = () => {
    console.log('search', searchInput)
    dispatch(articleSearch(searchInput))
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
          {' '}
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
            <input
              className="form-control me-2"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Поиск статей"
              aria-label="Search"
            />
            <Button onClick={searchHandler}>Поиск</Button>
          </div>
          <ul className="navbar-nav ms-auto">
            <div className="me-5">
              <Dropdown dropHeader={<img src={avatar} className="img-fluid rounded" alt="" width={30} />}>
                {dropdownLinks}
              </Dropdown>
            </div>
          </ul>
        </div>
      </div>
    </nav>
  )
}
