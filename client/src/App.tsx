import React, { useEffect } from 'react'
import { NavBar } from './components/UI/NavBar/NavBar'
import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { CreateArticle } from './pages/CreateArticle/CreateArticle'
// import { MyArticles } from './pages/MyArticles'
import { Profile } from './pages/Profile/Profile'
import { ArticlePage } from './pages/ArticlePage'
import { SubscribePage } from './pages/SubscribePage'
import { AuthPage } from './pages/AuthPage'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './store/rootReducer'
import { autoLogin } from './store/actions/AuthActions'
import { SearchPage } from './pages/SearchPage'

function App() {
  const dispatch = useDispatch()
  const { isAuth } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    dispatch(autoLogin())
  }, [dispatch])
  const AuthRouterHandler = () => {
    if (isAuth) {
      return (
        <>
          <NavBar />
          <div className="container-fluid bg-main">
            <Routes>
              <Route element={<HomePage />} path="/" />
              <Route element={<CreateArticle />} path="/create_article" />
              <Route element={<Profile />} path="/profile" />
              <Route element={<Profile />} path="/profile/:userName" />
              <Route element={<ArticlePage />} path="/article/:id" />
              <Route element={<SubscribePage />} path="/subscribe" />
              <Route element={<SearchPage />} path="/search" />
            </Routes>
          </div>
        </>
      )
    } else {
      return (
        <>
          <NavBar />
          <div className="container-fluid bg-main">
            <Routes>
              <Route element={<AuthPage />} path="/auth/:mode" />
              <Route element={<HomePage />} path="/" />
              <Route element={<ArticlePage />} path="/article/:id" />

              <Route element={<AuthPage />} path="/create_article" />
              <Route element={<AuthPage />} path="/my_articles" />
              <Route element={<AuthPage />} path="/profile" />
              <Route element={<AuthPage />} path="/profile/:userName" />
              <Route element={<AuthPage />} path="/subscribe" />
              <Route element={<SearchPage />} path="/search" />
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
