import React from 'react'
import { useParams } from 'react-router-dom'
import { staticArticles } from '../staticArticles'
import defaultAvatar from '../asserts/default_avatar.png'
import noImage from '../asserts/no_image.png'

export const ArticlePage: React.FC = () => {
  const { id: articleId } = useParams()
  const art = staticArticles.filter((art) => art.id === Number(articleId))[0]
  const avatarImage = art.author.avatar ? art.author.avatar : defaultAvatar
  const articleImage = art.info.image ? art.info.image : noImage

  return (
    <div className="card m-2">
      <div className="card-header">
        <img className="float-start rounded-circle" src={avatarImage} width={30} height={30} />
        <strong className="float-start ms-2">{art.author.name}</strong>
        <p className="float-end mb-0 fw-light">{art.date}</p>
      </div>
      <div className="card-body">
        <h2 className="card-title">{art.info.title}</h2>
        <img src={articleImage} className="card-img-top" alt="" />
        <p className="card-text">{art.info.content}...</p>
      </div>
      <div className="card-footer text-muted text-end">
        <i className="bi bi-eye"></i>
        {art.views}
      </div>
    </div>
  )
}
