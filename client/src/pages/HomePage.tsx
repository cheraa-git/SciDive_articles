import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ArticlesCardList } from '../components/ArticlesCardList/ArticlesCardList'
import { SpinLoader } from '../components/UI/Loader/SpinLoader'
import { SecondNavBar } from '../components/UI/SecondNavBar'
import { fetchHome } from '../store/actions/ArticleActions'
import { RootState } from '../store/rootReducer'

export const HomePage: React.FC = () => {
  const dispatch = useDispatch()
  const { loading } = useSelector((state: RootState) => state.article)
  // ассинхронное получение списка статей
  useEffect(() => {
    dispatch(fetchHome())
  }, [dispatch])
  return (
    <div>
      <SecondNavBar />
      {
        loading 
        ? <SpinLoader /> 
        : <ArticlesCardList  />
      }
    </div>
  )
}
