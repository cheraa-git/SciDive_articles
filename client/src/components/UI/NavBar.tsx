import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import logo from '../../asserts/logotip.png'
import { logoutUser } from '../../store/actions/AuthActions'
import { RootState } from '../../store/rootReducer'
import defaultAvatar from '../../asserts/default_avatar.png'

export const NavBar: React.FC = () => {
  const dispatch = useDispatch()
  const { isAuth } = useSelector((state: RootState) => state.auth)
  // const personIconHref = isAuth ? '/profile' : '/auth'
  const avatar = localStorage.getItem('userAvatar') || defaultAvatar

  const dropdownLinks = isAuth ? (
    <>
      <div className="d-flex dropdown-item">
        <NavLink to="/profile" className="lead mb-0 text-decoration-none ">
          @{localStorage.getItem('userName')}
        </NavLink>
        <img src={avatar} className="rounded ms-2" height={30} alt=''/>
      </div>
      <hr className="dropdown-divider" />
      <li>
        <NavLink className="dropdown-item" to="/profile/edit">
          <i className="bi bi-gear-fill me-2" />
          Настройка профиля
        </NavLink>
      </li>

      <hr className="dropdown-divider" />

      <li>
        <button className="dropdown-item" onClick={() => dispatch(logoutUser())}>
          Выход
        </button>
      </li>
    </>
  ) : (
    <>
      <li>
        <NavLink className="dropdown-item" to="/auth/login">
          Вход
        </NavLink>
      </li>
      <hr className="dropdown-divider" />
      <li>
        <NavLink className="dropdown-item" to="/auth/singup">
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
          <ul className="navbar-nav ms-auto">
            <>
              <div className="btn-group me-2 d-block" style={{ width: '3rem' }}>
                <button className="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                  <img src={avatar} className="img-fluid rounded" alt='' />
                </button>
                <ul className="dropdown-menu dropdown-menu-end p-2">{dropdownLinks}</ul>
              </div>
            </>
          </ul>
        </div>
      </div>
    </nav>
  )
}
