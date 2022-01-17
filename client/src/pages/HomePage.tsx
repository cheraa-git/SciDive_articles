import React from 'react'
import { useSelector } from 'react-redux'
import { ArticlesCardList } from '../components/ArticlesCardList/ArticlesCardList'
import { HomeNavBar } from '../components/UI/HomeNavBar'
import { RootState } from '../store/reducers/rootReducer'

export const HomePage: React.FC = () => {
  const {articles} = useSelector((state: RootState) => state.article)
  return (
    <div>
      <HomeNavBar/>
      <ArticlesCardList articles={articles} />
    </div>
  )
}
