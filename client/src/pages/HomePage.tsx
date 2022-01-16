import React from 'react'
import { ArticlesCardList } from '../components/ArticlesCardList/ArticlesCardList'
import { HomeNavBar } from '../components/UI/HomeNavBar'
import { staticArticles } from '../staticArticles'

export const HomePage: React.FC = () => {
  return (
    <div>
      <HomeNavBar/>
      <ArticlesCardList articles={staticArticles} />
    </div>
  )
}
