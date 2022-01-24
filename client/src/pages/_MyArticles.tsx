import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { ArticlesCardList } from '../components/ArticlesCardList/ArticlesCardList'
import { SecondNavBar } from '../components/UI/SecondNavBar'
import { fetchMyArticles } from '../store/actions/ArticleActions'
import { RootState } from '../store/rootReducer'

export const MyArticles: React.FC = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchMyArticles())
  }, [dispatch])
  const { articles, currentCategory } = useSelector((state: RootState) => state.article)

  return (
    <div>
      <SecondNavBar />
      <ArticlesCardList articles={articles} currentCategory={currentCategory} />
      {articles.length === 0 && (
        <p className="lead text-center">
          Хотите
          <NavLink className="link text-decoration-none ms-1" to="/create_article">
            создать
          </NavLink>
          ?
        </p>
      )}
    </div>
  )
}
