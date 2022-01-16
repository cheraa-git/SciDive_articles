import React from 'react'
import { Article } from '../../types/ArticleInterfaces'
import { ArticleItem } from './ArticleItem'

interface ArticlesCardListProps {
  articles: Article[]
}

export const ArticlesCardList: React.FC<ArticlesCardListProps> = (props) => {
  const content = props.articles.map((art, index) => {
    return (
      <ArticleItem article={art} mode='preview' key={index}/>
    )
  })

  return <div className="row justify-content-center">{content}</div>
}
