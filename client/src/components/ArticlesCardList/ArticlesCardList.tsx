import React from 'react'
import { Article } from '../../types/interfaces'
import { ArticleItem } from './ArticleItem'

interface ArticlesCardListProps {
  articles: Article[]
  currentCategory: string
}

export const ArticlesCardList: React.FC<ArticlesCardListProps> = (props) => {

  const filterArticles = props.articles.filter((art) => {
    if (props.currentCategory === 'Все категории') return art
    else if (art.category === props.currentCategory) return art
    return art
  })
  const content = filterArticles.map((art, index) => {
    return (
      <ArticleItem article={art} mode='preview' key={index}/>
    )
  })

  return <div className="row justify-content-center">{content}</div>
}
