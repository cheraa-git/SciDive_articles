import React from 'react'
import { NavLink } from 'react-router-dom'
import { Article } from '../../types/interfaces'
import noImage from '../../asserts/no_image.png'
import defaultAvatar from '../../asserts/default_avatar.png'
import { STATIC } from '../../config'

interface ArticleItemProps {
  article: Article
  mode: string
}

export const ArticleItem: React.FC<ArticleItemProps> = ({ article, mode }) => {
  console.log(article);
  
  const articleImage = article.image ? STATIC + article.image : noImage
  const avatarImage = article.author.avatar ? STATIC + article.author.avatar : defaultAvatar
  

  let text = '...'
  let style = {}
  if (mode === 'preview') {
    text = article.prev_content + '...'
    style = { width: '40%', minWidth: '20rem' }
  } else if (mode === 'full') {
    text = article.content
    style = { width: '60%', minWidth: '21rem' }
  }
  return (
    <div className="card m-2 p-0" style={style}>

      <div className="card-header">
        <img className="float-start rounded-circle" src={avatarImage} width={30} height={30} alt="" />

        <NavLink to={`/profile/${article.author.login}`} className="float-start ms-2 link">{article.author.login}</NavLink>

        <p className="float-start mb-0 ms-2 fw-light">{article.date}</p>

        <p className="float-end mb-0 fst-italic">{article.category}</p>
      </div>

      <div className="card-body">
        <h2 className="card-title">{article.title}</h2>
        <img src={articleImage} className="card-img-top" alt="" />
        <p className="card-text">{text}</p>
        {mode === 'preview' && (
          <NavLink to={`/article/${article.id}`} className="btn btn-primar">
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
