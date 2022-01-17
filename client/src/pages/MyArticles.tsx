import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ArticlesCardList } from '../components/ArticlesCardList/ArticlesCardList'
import { SecondNavBar } from '../components/UI/SecondNavBar'
import { fetchMyArticles } from '../store/actions/ArticleActions'
import { RootState } from '../store/reducers/rootReducer'

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
    </div>
  )
}
