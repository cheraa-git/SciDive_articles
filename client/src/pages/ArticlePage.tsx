import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { ArticleItem } from '../components/ArticlesCardList/ArticleItem'
import { useDispatch, useSelector } from 'react-redux'
import { fetchArticle } from '../store/actions/ArticleActions'
import { RootState } from '../store/rootReducer'
import { SpinLoader } from '../components/UI/Loader/SpinLoader'

export const ArticlePage: React.FC = () => {
  const dispatch = useDispatch()
  const { id: articleId } = useParams()

  useEffect(() => {
    dispatch(fetchArticle(Number(articleId)))
  }, [dispatch, articleId])

  const { articles, loading, error } = useSelector((state: RootState) => state.article)

  const Content = () => {
    if (loading) {
      return <SpinLoader />
    } else {
      if (articles.length > 0) {
        return <ArticleItem article={articles[0]} mode="full" />
      } else {
        return <h1 className="display-5 text-center">Статья не найдена...</h1>
      }
    }
  }

  return (
    <div className="row justify-content-center">
      <Content />
    </div>
  )
}
