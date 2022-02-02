import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useParams } from 'react-router-dom'
import defaultAvatar from '../asserts/default_avatar.png'
import { ArticlesCardList } from '../components/ArticlesCardList/ArticlesCardList'
import { CategoryDropdown } from '../components/CategoryDropdown'
import { SpinLoader } from '../components/UI/Loader/SpinLoader'
import { STATIC } from '../config'
import { fetchUserArticles } from '../store/actions/ArticleActions'
import { RootState } from '../store/rootReducer'

export const Profile: React.FC = () => {
  const dispatch = useDispatch()
  const { articles, currentCategory, loading } = useSelector((state: RootState) => state.article)
  const avatar = articles[0]?.author.avatar ? STATIC + articles[0]?.author.avatar : defaultAvatar
  const { userName } = useParams()
  const isMyProfile = userName === localStorage.getItem('userName')

  useEffect(() => {
    dispatch(fetchUserArticles(userName))
  }, [dispatch])

  const ArticleList = () => {
    if (loading) {
      return <SpinLoader/>
    } else {
      return articles.length > 0 ? (
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
      )
    }
  }

  return (
    <div className="card m-2 p-0">
      <div className="card-header d-flex">
        <div>
          <img className="rounded  me-3" src={avatar} alt="Аватар" height={150}></img>
          <div>
            <NavLink to="/profile" className="display-6 mb-0 text-decoration-none ">
              @{userName}
            </NavLink>
          </div>
        </div>

        <p>Публикаций: {articles.length}</p>
        {/* <a href="/" className="btn btn-light">
          Редактировать
        </a> */}
      </div>

      <div className="card-body">
        {isMyProfile && <h1 className="display-6 mb-0">Мои статьи</h1>}

        <CategoryDropdown />

        <ArticleList />
      </div>
    </div>
  )
}
