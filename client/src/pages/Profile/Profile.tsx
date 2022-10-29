import { Button, LinearProgress, MenuItem } from '@mui/material'
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
import { Dropdown } from '../../components/UI/Dropdown/Dropdown'

export const Profile: React.FC = () => {
  const dispatch = useDispatch()
  const { articles, loading: articleLoading, error: articleError } = useSelector((state: RootState) => state.article)
  let {
    loading: profileLoading,
    subscribers,
    subscriptions,
    blog_id,
    avatar,
  } = useSelector((state: RootState) => state.user)
  const userAvatar = avatar ? STATIC + avatar : defaultAvatar
  let { userName } = useParams()

  if (!userName) {
    userName = localStorage.getItem('userName')!
  }

  const isMyProfile = userName === localStorage.getItem('userName')
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [userDropToggle, setUserDropToggle] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (userName) {
      dispatch(fetchProfile(userName))
    } else {
      console.log('userName not found')
    }
  }, [dispatch, userName])
  useEffect(() => {
    dispatch(fetchUserArticles(userName))
  }, [dispatch, userName])
  const ArticleList = () => {
    if (articleError) {
      return (
        <div className="bg-translucent-light">
          <h1 className="display-6 text-center">Что-то пошло не так...</h1>
          <p className="lead text-center fs-5">
            Попробуйте перейти на <NavLink to={'/'}>главную</NavLink> или
            <a href={window.location.href}>перезагрузить</a> страницу
          </p>
        </div>
      )
    } else if (articleLoading) {
      return <SpinLoader />
    } else {
      return articles.length > 0 ? (
        <ArticlesCardList />
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
        <>
          <MenuItem className="mb-0" onClick={() => setEditDialogOpen(true)}>
            Редактировать
          </MenuItem>
        </>
      )
    }

    if (subscribers.findIndex(el => el.login === localStorage.getItem('userName')) >= 0) {
      return (
        <>
          <MenuItem onClick={() => dispatch(unfollow(blog_id, localStorage.getItem('userName')!))}>
            Отменить подписку
          </MenuItem>
        </>
      )
    }

    return (
      <>
        <MenuItem onClick={() => dispatch(follow(articles[0].blog_id))}>Подписаться</MenuItem>
      </>
    )
  }

  return (
    <div className="m-2 p-0">
      {profileLoading && <LinearProgress />}
      <div className={`bg-translucent-dark d-flex ${profileLoading && 'opacity-50'}`}>
        <div>
          <img className="rounded m-3" src={userAvatar} alt="Аватар" height={150} />
          <Button
            className="fs-3 link"
            style={{ textTransform: 'none' }}
            endIcon={<i className="bi bi-caret-down" />}
            id="username-dropdown-button"
            onClick={e => setUserDropToggle(prev => (prev ? null : e.currentTarget))}
          >
            @{userName}
          </Button>
          <Dropdown anchorEl={userDropToggle} onClose={() => setUserDropToggle(null)}>
            <DropdownItems />
          </Dropdown>
        </div>
        <div className="container profile-info">
          <div>
            <p className="lead">
              Публикаций: <strong className="me-2">{articles.length}</strong>
            </p>
            <p className="lead" data-bs-toggle="dropdown">
              Подписок: <strong className="me-2">{subscriptions.length}</strong>
            </p>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton2">
              {subscriptions.map((el, index) => (
                <li key={index}>
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
            <p className="lead" data-bs-toggle="dropdown">
              Подписчиков: <strong className="me-2">{subscribers.length}</strong>
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
        <div style={{ width: 'min-content' }}>
          <CategoryDropdown />
        </div>
        <ArticleList />
      </div>
    </div>
  )
}
