import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { setCurrentCategory } from '../../store/actions/ArticleActions'
import { RootState } from '../../store/rootReducer'

export const SecondNavBar: React.FC = () => {
  const dispatch = useDispatch()
  const { categoryList, currentCategory } = useSelector((state: RootState) => state.article)

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
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle lead"
                href="/"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {currentCategory}
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                {categoryList.map((el, index) => (
                  <li key={index} onClick={() => dispatch(setCurrentCategory(el))}>
                    <p className="dropdown-item m-0 ">{el}</p>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
