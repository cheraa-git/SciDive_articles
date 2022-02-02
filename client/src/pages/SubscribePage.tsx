import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ArticlesCardList } from '../components/ArticlesCardList/ArticlesCardList'
import { SpinLoader } from '../components/UI/Loader/SpinLoader'
import { SecondNavBar } from '../components/UI/SecondNavBar'
import { fetchSubscribe } from '../store/actions/ArticleActions'
import { RootState } from '../store/rootReducer'

export const SubscribePage: React.FC = () => {
  const dispatch = useDispatch()
  const { articles, currentCategory, loading } = useSelector((state: RootState) => state.article)

  useEffect(() => {
    dispatch(fetchSubscribe())
  }, [dispatch])
  return (
    <div>
      <SecondNavBar />
      {loading ? <SpinLoader /> : <ArticlesCardList articles={articles} currentCategory={currentCategory} />}{' '}
    </div>
  )
}
