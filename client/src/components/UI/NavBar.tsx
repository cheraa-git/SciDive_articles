import React from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import logo from '../../asserts/logotip.png'
import { RootState } from '../../store/rootReducer'

export const NavBar: React.FC = () => {
  const {isAuth} = useSelector((state: RootState) => state.auth)
  const personIconHref = isAuth ? '/profile' : '/auth'
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
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
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse fs-5" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className={`nav-link`} aria-current="page" to="/">
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
          <div className="d-flex ms-auto">
            <NavLink className="nav-link" to={personIconHref}>
              <i className='bi bi-person fs-2'/>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  )
}
