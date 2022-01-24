import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useParams } from 'react-router-dom'
import defaultAvatar from '../asserts/default_avatar.png'
import { ArticlesCardList } from '../components/ArticlesCardList/ArticlesCardList'
import { CategoryDropdown } from '../components/CategoryDropdown'
import { fetchUserArticles } from '../store/actions/ArticleActions'
import { RootState } from '../store/rootReducer'

export const Profile: React.FC = () => {
  const avatar = localStorage.getItem('userAvatar') || defaultAvatar
  const dispatch = useDispatch()
  const { userName } = useParams()

  useEffect(() => {
    dispatch(fetchUserArticles(userName))
  }, [dispatch])
  const { articles, currentCategory } = useSelector((state: RootState) => state.article)

  return (
    <div className="card m-2 p-0">
      <div className="card-header d-flex">
        <div>
          <img className="rounded  me-3" src={avatar} alt="Аватар" height={150}></img>
          <div>
            <NavLink to="/profile" className="display-6 mb-0 text-decoration-none ">
              @{localStorage.getItem('userName')}
            </NavLink>
          </div>
        </div>

        <a href="/" className="btn btn-light">
          Редактировать
        </a>
      </div>
      <div className="card-body"></div>

      <div>
        <div className="container">
          <h1 className="display-6 mb-0">Мои статьи</h1>
          <CategoryDropdown />
        </div>
        {articles.length > 0 ? (
          <ArticlesCardList articles={articles} currentCategory={currentCategory} />
        ) : (
          <>
            <h1 className="display-6 text-center">Статей пока нет...</h1>
            <p className="lead text-center">
              Хотите{' '}
              <NavLink className="link" to="/create_article">
                создать
              </NavLink>
              ?
            </p>
          </>
        )}
      </div>
    </div>
  )
}
