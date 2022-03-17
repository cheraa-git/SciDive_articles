import React from 'react'
import { Article } from '../../types/interfaces'
import { ArticleItem } from './ArticleItem'

interface ArticlesCardListProps {
  articles: Article[]
  currentCategory: string
}

export const ArticlesCardList: React.FC<ArticlesCardListProps> = (props) => {
  let filterArticles = props.articles
  if (props.currentCategory !== 'Все категории') {
    filterArticles = filterArticles.filter((art) => art.category === props.currentCategory)
  }

  let a = [{'a': 1}, {'b': 2}, {'c': 3}, {'d': 4}, {'e': 5}]
  a.reverse()
  console.log('A',a)
  
  const content =
    props.articles.length > 0 ? (
      filterArticles.reverse().map((art, index) => {
        return <ArticleItem article={art} mode="preview" key={index} />
      })
    ) : (
      <>
        <h1 className="display-6 text-center">Статей пока нет...</h1>
      </>
    )

  return <div className="row justify-content-center">{content}</div>
}
