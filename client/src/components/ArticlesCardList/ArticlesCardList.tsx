import React from 'react'
import { Article } from '../../types/interfaces'
import noImage from '../../asserts/no_image.png'
import defaultAvatar from '../../asserts/default_avatar.png'
import { NavLink } from 'react-router-dom'

interface ArticlesCardListProps {
  articles: Article[]
}

export const ArticlesCardList: React.FC<ArticlesCardListProps> = (props) => {
  const content = props.articles.map((art, index) => {
    const articleImage = art.info.image ? art.info.image : noImage
    const avatarImage = art.author.avatar ? art.author.avatar : defaultAvatar
    const previewText = art.info.content.split(' ').slice(0, 20).join(' ')

    return (
      <div className="card m-2 p-0" style={{ width: '40%', minWidth: '20rem' }} key={index}>
        <div className="card-header">
          <img className="float-start rounded-circle" src={avatarImage} width={30} height={30} />
          <strong className="float-start ms-2">{art.author.name}</strong>
          <p className="float-end mb-0 fw-light">{art.date}</p>
        </div>
        <div className="card-body">
          <h2 className="card-title">{art.info.title}</h2>
          <img src={articleImage} className="card-img-top" alt="" />
          <p className="card-text">{previewText}...</p>
          <NavLink to={`/article/${art.id}`} className="btn btn-primary">
            Читать далее
          </NavLink>
        </div>
        <div className="card-footer text-muted text-end">
          <i className="bi bi-eye"></i>
          {art.views}
        </div>
      </div>
    )
  })

  return <div className="row justify-content-center">{content}</div>
}
