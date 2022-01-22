import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import image from '../asserts/logotip.png'
import { ArticlesCardList } from '../components/ArticlesCardList/ArticlesCardList'
import { SecondNavBar } from '../components/UI/SecondNavBar'
import { fetchMyArticles } from '../store/actions/ArticleActions'
import { RootState } from '../store/rootReducer'

export const Profile: React.FC = () => {
  const userName = 'AlexanderChernetsov'
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchMyArticles())
  }, [dispatch])
  const { articles, currentCategory } = useSelector((state: RootState) => state.article)

  return (
    <div className="card m-2 p-0">
      <div className="card-header">
        <img className="rounded-circle mb-3" src={image} alt="Аватар"></img>
        <h1 className="fs-6">{userName}</h1>

      </div>
      <div className="card-body">
        <a href="#" className="btn btn-primary">Редактировать</a>
      </div>

      <div>
      <SecondNavBar />
      {articles.length > 0 ? (
        <ArticlesCardList articles={articles} currentCategory={currentCategory} />
      ) : (
        <>
          <h1 className="display-6 text-center">Статей пока нет...</h1>
          <p className="lead text-center">Хотите <NavLink className="link" to='/create_article'>создать</NavLink>?</p>
        </>
      )}
    </div>
    </div>
  )
}
