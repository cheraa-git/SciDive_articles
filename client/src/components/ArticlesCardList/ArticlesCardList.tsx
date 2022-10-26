import React from 'react'
import { useSelector } from 'react-redux'
import { translit } from '../../auxiliary_functions'
import { RootState } from '../../store/rootReducer'
import { Article } from '../../types/interfaces'
import { ArticleItem } from './ArticleItem'

console.log('translit', translit('привет как дела'))

interface ArticlesCardListProps {
  articles: Article[]
  currentCategory: string
}

export const ArticlesCardList: React.FC<ArticlesCardListProps> = props => {
  const { search } = useSelector((state: RootState) => state.article)

  let filterArticles = props.articles
  if (props.currentCategory !== 'Все категории') {
    filterArticles = filterArticles.filter(art => art.category === props.currentCategory)
  }
  if (search.request) {
    const request = search.request.toLowerCase()
    filterArticles = filterArticles.filter(art => art.title.toLowerCase().indexOf(request) > -1)
  }

  filterArticles = filterArticles.reverse()
  const reverseArticles = []
  for (let i = 0; i < filterArticles.length; i++) {
    reverseArticles[i] = filterArticles[filterArticles.length - 1 - i]
  }

  const content =
    props.articles.length > 0 ? (
      reverseArticles.map((art, index) => {
        return <ArticleItem article={art} mode="preview" key={index} />
      })
    ) : (
      <>
        <h1 className="display-6 text-center">Статей пока нет...</h1>
      </>
    )

  return <div className="row justify-content-center">{content}</div>
}
