import { Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useParams } from 'react-router-dom'
import defaultAvatar from '../../asserts/default_avatar.png'
import { ArticlesCardList } from '../../components/ArticlesCardList/ArticlesCardList'
import { CategoryDropdown } from '../../components/CategoryDropdown'
import { SpinLoader } from '../../components/UI/Loader/SpinLoader'
import { STATIC } from '../../config'
import { fetchUserArticles } from '../../store/actions/ArticleActions'
import { RootState } from '../../store/rootReducer'
import { EditProfileDialog } from './EditProfileDialog'
import './Profile.sass'

export const Profile: React.FC = () => {
  const dispatch = useDispatch()
  const { articles, currentCategory, loading } = useSelector((state: RootState) => state.article)
  const avatar = articles[0]?.author.avatar ? STATIC + articles[0]?.author.avatar : defaultAvatar
  const { userName } = useParams()
  const isMyProfile = userName === localStorage.getItem('userName')

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  useEffect(() => {
    dispatch(fetchUserArticles(userName))
  }, [dispatch, userName])

  const ArticleList = () => {
    if (loading) {
      return <SpinLoader />
    } else {
      return articles.length > 0 ? (
        <ArticlesCardList articles={articles} currentCategory={currentCategory} />
      ) : (
        <>
          <h1 className="display-6 text-center">Статей пока нет...</h1>
          <p className="lead text-center">
            Хотите
            <NavLink className="link" to="/create_article">
              создать
            </NavLink>
            ?
          </p>
        </>
      )
    }
  }

  const Buttons = () => {
    if (localStorage.getItem('userName') === userName) {
      return <Button onClick={() => setEditDialogOpen(true)}>Редактировать профиль</Button>
    } else {
      return <Button>Подписаться</Button>
    }
  }

  return (
    <div className="card m-2 p-0">
      <div className="card-header d-flex">
        <div>
          <img className="rounded  me-3" src={avatar} alt="Аватар" height={150}></img>
          <div>
            <NavLink to={`/profile/${userName}`} className="display-6 mb-0 text-decoration-none ">
              @{userName}
            </NavLink>
          </div>
        </div>
        <div className="container profile-info">
          <div className="row">
            <p className="lead col ">
              <strong>{articles.length}</strong>
              <br />
              публикаций
            </p>

            <p className="lead col ">
              <strong>8</strong>
              <br />
              подписок
            </p>
            <p className="lead col ">
              <strong>20</strong>
              <br />
              подписчиков
            </p>
          </div>
          <div className="buttons">
            <Buttons />
            <EditProfileDialog isOpen={editDialogOpen} handleClose={() => setEditDialogOpen(false)}/>
          </div>
        </div>
      </div>

      <div className="card-body">
        {isMyProfile && <h1 className="display-6 mb-0">Мои статьи</h1>}

        <CategoryDropdown />

        <ArticleList />
      </div>
    </div>
  )
}
