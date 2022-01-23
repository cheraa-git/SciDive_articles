import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentCategory } from '../store/actions/ArticleActions'
import { RootState } from '../store/rootReducer'

export const CategoryDropdown: React.FC = () => {
  const dispatch = useDispatch()
  const { categoryList, currentCategory } = useSelector((state: RootState) => state.article)

  return (
    <li className="nav-item dropdown " style={{ listStyleType: 'none' }}>
      <a
        className="nav-link dropdown-toggle lead text-dark opacity-75"
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
  )
}
