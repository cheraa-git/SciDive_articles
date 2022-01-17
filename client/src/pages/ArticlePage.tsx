import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { staticArticles } from '../staticArticles'

import { ArticleItem } from '../components/ArticlesCardList/ArticleItem'
import { useDispatch, useSelector } from 'react-redux'
import { fetchArticle } from '../store/actions/ArticleActions'
import { RootState } from '../store/reducers/rootReducer'

export const ArticlePage: React.FC = () => {
  const dispatch = useDispatch()
  const { id: articleId } = useParams()
  useEffect(() => {
    dispatch(fetchArticle(Number(articleId)))
  }, [dispatch, articleId])
  const {articles} = useSelector((state: RootState) => state.article)
  return (
    <div className="row justify-content-center">
      <ArticleItem article={articles[0]} mode="full" />
    </div>
  )
}
