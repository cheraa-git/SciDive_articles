import React from 'react'
import { useParams } from 'react-router-dom'

export const Article: React.FC = (props) => {
  const { id: articleId } = useParams()

  return (
    <div>
      <h1>Article id: {articleId}</h1>
    </div>
  )
}
