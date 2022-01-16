import React from 'react'
import { ArticlesCardList } from '../components/ArticlesCardList/ArticlesCardList'
import { staticArticles } from '../staticArticles'

export const MyArticles: React.FC = () => {
  const blog_id = 2
  const articles = staticArticles.filter((art) => art.blog_id === blog_id)
  return (
    <div>
      <ArticlesCardList articles={articles} />
    </div>
  )
}
