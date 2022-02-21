import { Backdrop, Box, Button, LinearProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useParams } from 'react-router-dom'
import defaultAvatar from '../../asserts/default_avatar.png'
import { ArticlesCardList } from '../../components/ArticlesCardList/ArticlesCardList'
import { CategoryDropdown } from '../../components/CategoryDropdown'
import { SpinLoader } from '../../components/UI/Loader/SpinLoader'
import { STATIC } from '../../config'
import { fetchUserArticles } from '../../store/actions/ArticleActions'
import { fetchProfile, follow, unfollow } from '../../store/actions/UserActions'
import { RootState } from '../../store/rootReducer'
import { EditProfileDialog } from './ProfileDialogs/EditProfileDialog'
import './Profile.sass'

export const Profile: React.FC = () => {
  const dispatch = useDispatch()
  const { articles, currentCategory, loading: articleLoading } = useSelector((state: RootState) => state.article)
  const { loading: profileLoading, subscribers, subscriptions, blog_id } = useSelector((state: RootState) => state.user)
  const avatar = articles[0]?.author.avatar ? STATIC + articles[0]?.author.avatar : defaultAvatar
  const { userName } = useParams()
  const isMyProfile = userName === localStorage.getItem('userName')

  const [editDialogOpen, setEditDialogOpen] = useState(false)

  useEffect(() => {
    if (userName) {
      dispatch(fetchProfile(userName))
    } else {
      console.log('userName not found')
    }
  }, [dispatch])
  useEffect(() => {
    dispatch(fetchUserArticles(userName))
  }, [dispatch, userName])

  const ArticleList = () => {
    if (articleLoading) {
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

  const DropdownItems = () => {
    if (localStorage.getItem('userName') === userName) {
      return (
        <li>
          <p className="dropdown-item mb-0" onClick={() => setEditDialogOpen(true)}>
            Редактировать
          </p>
        </li>
      )
    } else {
      if (subscribers.findIndex((el) => el.login === localStorage.getItem('userName')) >= 0) {
        return (
          <li>
            <p
              className="dropdown-item mb-0"
              onClick={() => dispatch(unfollow(blog_id, localStorage.getItem('userName')!))}
            >
              Отменить подписку
            </p>
          </li>
        )
      } else {
        return (
          <li>
            <p className="dropdown-item mb-0" onClick={() => dispatch(follow(articles[0].blog_id))}>
              Подписаться
            </p>
          </li>
        )
      }
    }
  }

  return (
    <div className="card m-2 p-0">
      {profileLoading && <LinearProgress />}
      <div className={`card-header d-flex ${profileLoading && 'opacity-50'}`}>
        <div>
          <img className="rounded  me-3" src={avatar} alt="Аватар" height={150}></img>

          <div className="dropdown">
            <Button
              className="fs-3 link"
              data-bs-toggle="dropdown"
              style={{ textTransform: 'none' }}
              endIcon={<i className="bi bi-caret-down" />}
            >
              @{userName}
            </Button>

            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <DropdownItems />
            </ul>
          </div>
        </div>
        <div className="container profile-info">
          <div>
            <p className="lead">
              Публикаций: <strong className="me-2">{articles.length}</strong>
            </p>

            <p className="lead" data-bs-toggle="dropdown">
              <strong className="me-2">Подписок: {subscriptions.length}</strong>
            </p>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton2">
              {subscriptions.map((el, index) => (
                <li key={index}>
                  <NavLink to={`/profile/${el.login}`} className="dropdown-item mb-0">
                    {el.login}
                  </NavLink>
                </li>
              ))}
            </ul>

            <p className="lead" data-bs-toggle="dropdown">
              <strong className="me-2">Подписчиков: {subscribers.length}</strong>
            </p>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton3">
              {subscribers.map((el, index) => (
                <li key={index} className="d-flex">
                  <NavLink to={`/profile/${el.login}`} className="dropdown-item mb-0">
                    <img
                      className="float-start rounded-circle me-3"
                      src={STATIC + el.avatar}
                      width={25}
                      height={25}
                      alt=""
                    />
                    {el.login}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="buttons ms-auto">
            <EditProfileDialog isOpen={editDialogOpen} handleClose={() => setEditDialogOpen(false)} />
          </div>
        </div>
      </div>

      <div className="card-body">
        {isMyProfile && <h1 className="display-6 mb-0">Мои статьи</h1>}

        <div style={{width: 'min-content'}}>
          <CategoryDropdown />
        </div>

        <ArticleList />
      </div>
    </div>
  )
}
