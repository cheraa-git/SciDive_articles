import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ArticlesCardList } from '../components/ArticlesCardList/ArticlesCardList'
import { SecondNavBar } from '../components/UI/SecondNavBar'
import { fetchHome } from '../store/actions/ArticleActions'
import { authDataPost } from '../store/actions/AuthActions'
import { RootState } from '../store/rootReducer'

export const HomePage: React.FC = () => {
  const dispatch = useDispatch()
  const { articles, currentCategory } = useSelector((state: RootState) => state.article)
  useEffect(() => {
    dispatch(fetchHome())
    // dispatch(authDataPost({login: 'AYE88', password: '111111'}))
  }, [dispatch])
  return (
    <div>
      <SecondNavBar />
      <ArticlesCardList articles={articles} currentCategory={currentCategory} />
    </div>
  )
}
