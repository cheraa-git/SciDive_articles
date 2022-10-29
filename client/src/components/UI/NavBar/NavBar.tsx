import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import logo from '../../../asserts/logotip.png'
import { logoutUser } from '../../../store/actions/AuthActions'
import { RootState } from '../../../store/rootReducer'
import defaultAvatar from '../../../asserts/default_avatar.png'
import { STATIC } from '../../../config'
import { Dropdown } from '../Dropdown/Dropdown'
import { MenuItem } from '@mui/material'
import './NavBar.sass'
import { SearchInput } from '../../SearchInput/SearchInput'

export const NavBar: React.FC = () => {
  const dispatch = useDispatch()
  const { isAuth } = useSelector((state: RootState) => state.auth)
  const avatar = localStorage.getItem('userAvatar') ? STATIC + localStorage.getItem('userAvatar') : defaultAvatar
  const [profileImgToggle, setProfileImgToggle] = useState<HTMLElement | null>(null)

  const dropdownLinks = isAuth ? (
    <>
      <NavLink
        to={`/profile/${localStorage.getItem('userName')}`}
        className="lead mb-0 text-decoration-none"
        onClick={() => setProfileImgToggle(null)}
      >
        @{localStorage.getItem('userName')}
      </NavLink>

      <hr className="dropdown-divider" />

      <MenuItem
        onClick={() => {
          dispatch(logoutUser())
          setProfileImgToggle(null)
        }}
      >
        Выход
      </MenuItem>
    </>
  ) : (
    <>
      <li>
        <NavLink className="dropdown-item rounded" to="/auth/login" onClick={() => setProfileImgToggle(null)}>
          Вход
        </NavLink>
      </li>
      <hr className="dropdown-divider" />
      <li>
        <NavLink className="dropdown-item rounded" to="/auth/signup" onClick={() => setProfileImgToggle(null)}>
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

          <SearchInput />

          <ul className="navbar-nav ms-auto">
            <div className="me-5">
              <img
                src={avatar}
                className="img-fluid rounded"
                alt="Avatar"
                width={30}
                onClick={e => setProfileImgToggle(prev => (prev ? null : e.currentTarget))}
              />
              <Dropdown anchorEl={profileImgToggle} onClose={() => setProfileImgToggle(null)} align="end">
                {dropdownLinks}
              </Dropdown>
            </div>
          </ul>
        </div>
      </div>
    </nav>
  )
}
