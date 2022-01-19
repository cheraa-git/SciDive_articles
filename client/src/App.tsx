import React, { useEffect } from 'react'
import { NavBar } from './components/UI/NavBar'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { CreateArticle } from './pages/CreateArticle'
import { MyArticles } from './pages/MyArticles'
import { Profile } from './pages/Profile'
import { ArticlePage } from './pages/ArticlePage'
import { SubscribePage } from './pages/SubscribePage'
import { AuthPage } from './pages/AuthPage'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './store/rootReducer'
import { autoLogin } from './store/actions/AuthActions'

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {isAuth} = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    dispatch(autoLogin(navigate))
  }, [dispatch])
  const AuthRouterHandler = () => {
    if (isAuth) {
      return (
        <>
          <NavBar />
          <div className="container">
            <Routes>
              <Route element={<HomePage />} path="/" />
              <Route element={<CreateArticle />} path="/create_article" />
              <Route element={<MyArticles />} path="/my_articles" />
              <Route element={<Profile />} path="/profile" />
              <Route element={<ArticlePage />} path="/article/:id" />
              <Route element={<SubscribePage />} path="/subscribe" />
            </Routes>
          </div>
        </>
      )
    } else {
      return (
        <>
          <NavBar />
          <div className="container">
            <Routes>
              <Route element={<AuthPage />} path="/auth" />
              <Route element={<HomePage />} path="/" />
              <Route element={<ArticlePage />} path="/article/:id" />


            </Routes>
          </div>
        </>
      )
    }
  }
  return (
    <>
      <AuthRouterHandler />
    </>
  )
}

export default App
