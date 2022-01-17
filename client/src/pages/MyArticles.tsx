import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ArticlesCardList } from '../components/ArticlesCardList/ArticlesCardList'
import { clearArticles } from '../store/actions/ArticleActions'
import { RootState } from '../store/reducers/rootReducer'

export const MyArticles: React.FC = () => {
  const dispatch = useDispatch()
  const {articles} = useSelector((state: RootState) => state.article)
  return (
    <div>
      <button onClick={() => dispatch(clearArticles())}>clear</button>
      <ArticlesCardList articles={articles} />
    </div>
  )
}
