import React from 'react'
import { useParams } from 'react-router-dom'
import { staticArticles } from '../staticArticles'

import { ArticleItem } from '../components/ArticlesCardList/ArticleItem'

export const ArticlePage: React.FC = () => {
  const { id: articleId } = useParams()
  const art = staticArticles.filter((art) => art.id === Number(articleId))[0]

  return (
    <div className="row justify-content-center">
      <ArticleItem article={art} mode="full" />
    </div>
  )
}
