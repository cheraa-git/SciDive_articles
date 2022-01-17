import React from 'react'
import { NavLink } from 'react-router-dom'
import { Article } from '../../types/interfaces'
import noImage from '../../asserts/no_image.png'
import defaultAvatar from '../../asserts/default_avatar.png'

interface ArticleItemProps {
  article: Article
  mode: string
}

export const ArticleItem: React.FC<ArticleItemProps> = ({ article, mode }) => {
  const articleImage = article.info.image ? article.info.image : noImage
  const avatarImage = article.author.avatar ? article.author.avatar : defaultAvatar
  let text = '...'
  let style = {}
  if (mode === 'preview') {
    text = article.info.content.split(' ').slice(0, 20).join(' ')
    style = { width: '40%', minWidth: '20rem' }
  } else if (mode === 'full') {
    text = article.info.content
    style = { width: '60%', minWidth: '21rem',  }
  }
  return (
    <div className="card m-2 p-0" style={style}>
      <div className="card-header">
        <img className="float-start rounded-circle" src={avatarImage} width={30} height={30} />
        <strong className="float-start ms-2">{article.author.login}</strong>
        <p className="float-end mb-0 fw-light">{article.date}</p>
      </div>
      <div className="card-body">
        <h2 className="card-title">{article.info.title}</h2>
        <img src={articleImage} className="card-img-top" alt="" />
        <p className="card-text">{text}...</p>
        {mode === 'preview' && (
          <NavLink to={`/article/${article.id}`} className="btn btn-primary">
            Читать далее
          </NavLink>
        )}
      </div>
      <div className="card-footer text-muted text-end">
        <i className="bi bi-eye"></i>
        {article.views}
      </div>
    </div>
  )
}
