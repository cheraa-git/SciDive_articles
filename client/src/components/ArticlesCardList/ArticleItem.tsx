import React, { useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Article } from '../../types/interfaces'
import defaultAvatar from '../../asserts/default_avatar.png'
import { STATIC } from '../../config'
import { Card, CardMedia, IconButton } from '@mui/material'
import MenuList from '../UI/MenuList'
import { useDispatch } from 'react-redux'
import { addView, fetchArticle } from '../../store/actions/ArticleActions'
import './Article.sass'

interface ArticleItemProps {
  article: Article
  mode: string
}

const formatDate = (date: string) => {
  let fDate = new Date(date).toLocaleString().slice(0, 17).replace(',', ' в')
  const nDate = new Date().toLocaleString().slice(0, 17).replace(',', ' в')
  if (fDate.slice(3, 10) === nDate.slice(3, 10)) {
    if (fDate.slice(0, 2) === nDate.slice(0, 2)) {
      fDate = fDate.replace(fDate.slice(0, 10), 'Сегодня')
    } else if (Number(nDate.slice(0, 2)) - Number(fDate.slice(0, 2)) === 1) {
      fDate = fDate.replace(fDate.slice(0, 10), 'Вчера')
    }
  }
  return fDate
}
export const ArticleItem: React.FC<ArticleItemProps> = ({ article, mode }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const articleImage = article.image ? STATIC + article.image : ''
  const avatarImage = article.author.avatar ? STATIC + article.author.avatar : defaultAvatar
  let listItems = [{ label: 'Открыть статью', onClick: () => navigate(`/article/${article.id}`) }]

  const footerRef = useRef<HTMLDivElement>(null)

  if (article.author.login === localStorage.getItem('userName')) {
    listItems.push({
      label: 'Редактировать',
      onClick: async () => {
        await dispatch(fetchArticle(article.id))
        navigate(`/create_article?editArticleId=${article.id}`)
      },
    })
    listItems.push({ label: 'Перейти в профиль', onClick: () => navigate(`/profile/${article.author.login}`) })
  } else {
    listItems.push({ label: 'Перейти к автору', onClick: () => navigate(`/profile/${article.author.login}`) })
  }

  let textList = null
  let textList2 = null
  let style = {}

  if (mode === 'preview') {
    textList = article.prev_content + '...'
    style = { width: '40%', minWidth: '20rem' }
  } else if (mode === 'full') {
    textList = article.content
    style = { width: '60%', minWidth: '21rem' }
  }

  const tags = () => {
    if (article.tags) {
      return article.tags.map((tag, i) => <a key={i}>#{tag}&nbsp;</a>)
    }
  }

  return (
    <div className="card m-2 p-3 bg-translucent-light" style={style}>
      <div className="d-block">
        <div className="d-flex">
          <img className="float-start rounded-circle" src={avatarImage} width={30} height={30} alt="" />
          <NavLink to={`/profile/${article.author.login}`} className="float-start ms-2 link">
            {article.author.login}
          </NavLink>{' '}
          <IconButton
            className="ms-auto p-0"
            size="small"
            onClick={(event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)}
          >
            <i className="bi bi-list" />
          </IconButton>
          <MenuList anchorEl={anchorEl} setAnchorEl={setAnchorEl} items={listItems} />
        </div>
        <hr className="m-2" />
        <div>
          <p className="float-start mb-0 ms-2 fw-light">{formatDate(article.date)}</p>
          <p className="float-end mb-0 fst-italic">{article.category}</p>
        </div>
      </div>

      <div className="card-body">
        <h2 className="card-title display-5">{article.title}</h2>
        <img src={articleImage} className="" alt="" decoding="async" height="200px" />
        <div dangerouslySetInnerHTML={{ __html: textList! }} />

        {mode === 'preview' && (
          <NavLink
            to={`/article/${article.id}`}
            onClick={() => dispatch(addView(Number(article.id)))}
            className="btn btn-primary mt-2 align-bottom"
            style={{ marginBottom: `${footerRef.current ? footerRef.current?.offsetHeight : 50}px` }}
          >
            Читать далее
          </NavLink>
        )}
      </div>
      <div className="artFooter" ref={footerRef} style={{ position: 'absolute', bottom: '10px', marginTop: '100px' }}>
        {tags()}
        <i className="bi bi-eye ms-auto"></i>
        {article.views}
      </div>
    </div>
  )
}
