import React from 'react'
import { ArticlesCardList } from '../components/ArticlesCardList/ArticlesCardList'
import { staticArticles } from '../staticArticles'

export const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <ArticlesCardList articles={staticArticles} />
    </div>
  )
}
