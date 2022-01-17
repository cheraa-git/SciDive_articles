import React from 'react'
import { useSelector } from 'react-redux'
import { ArticlesCardList } from '../components/ArticlesCardList/ArticlesCardList'
import { SecondNavBar } from '../components/UI/SecondNavBar'
import { RootState } from '../store/reducers/rootReducer'

export const SubscribePage: React.FC = () => {
  const { articles, currentCategory } = useSelector((state: RootState) => state.article)

  return (
    <div>
      <SecondNavBar />
      subscribe
      <ArticlesCardList articles={articles} currentCategory={currentCategory} />
    </div>
  )
}
