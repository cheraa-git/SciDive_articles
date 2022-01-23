import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { setCurrentCategory } from '../../store/actions/ArticleActions'
import { RootState } from '../../store/rootReducer'
import { CategoryDropdown } from '../CategoryDropdown'

export const SecondNavBar: React.FC = () => {

  return (
    <nav className="navbar navbar-expand navbar-light bg-light ">
      <div className="container">
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav m-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link lead" aria-current="page" to="/">
                 Все статьи
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link lead" to="/subscribe">
                Подписки
              </NavLink>
            </li>
            <CategoryDropdown />
          </ul>
        </div>
      </div>
    </nav>
  )
}
