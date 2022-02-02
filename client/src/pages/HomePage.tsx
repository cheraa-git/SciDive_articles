import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ArticlesCardList } from '../components/ArticlesCardList/ArticlesCardList'
import { SpinLoader } from '../components/UI/Loader/SpinLoader'
import { SecondNavBar } from '../components/UI/SecondNavBar'
import { fetchHome } from '../store/actions/ArticleActions'
import { authDataPost, postRegisterData } from '../store/actions/AuthActions'
import { RootState } from '../store/rootReducer'

export const HomePage: React.FC = () => {
  const dispatch = useDispatch()
  const { articles, currentCategory, loading } = useSelector((state: RootState) => state.article)
  useEffect(() => {
    dispatch(fetchHome())
  }, [dispatch])
  return (
    <div>
      <SecondNavBar />
      {loading ? <SpinLoader /> : <ArticlesCardList articles={articles} currentCategory={currentCategory} />}
    </div>
  )
}
