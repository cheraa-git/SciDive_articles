import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import logo from '../../asserts/logotip.png'
import { logoutUser } from '../../store/actions/AuthActions'
import { RootState } from '../../store/rootReducer'

export const NavBar: React.FC = () => {
  const dispatch = useDispatch()
  const { isAuth } = useSelector((state: RootState) => state.auth)
  const personIconHref = isAuth ? '/profile' : '/auth'
  const authButton = isAuth ? (
    <li className="nav-item">
      <button className='btn btn-link nav-link' onClick={() => dispatch(logoutUser())}>Выход</button>
    </li>
  ) : (
    <>
      <li className="nav-item">
        <NavLink className="nav-link" to="/auth/login">
          Вход
        </NavLink>
      </li>
      <div className="vr opacity-75 my-2" style={{ color: 'white' }}></div>
      <li>
        <NavLink className="nav-link" to="/auth/singup">
          Регистрация
        </NavLink>
      </li>
    </>
  )
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-0">
      <div className="container-fluid">
        <a className="navbar-brand " href="/">
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
            <li className="nav-item">
              <NavLink
                className={`nav-link ${document.location.pathname === '/my_articles' && 'active'}`}
                to="/my_articles"
              >
                Мои статьи
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={`nav-link `} to="/profile">
                Профиль
              </NavLink>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">{authButton}</ul>
        </div>
      </div>
    </nav>
  )
}
