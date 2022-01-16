import React from 'react'
import { NavBar } from './components/UI/NavBar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { CreateArticle } from './pages/CreateArticle'
import { MyArticles } from './pages/MyArticles'
import { Profile } from './pages/Profile'
import { Article } from './pages/Article'

function App() {
;
  return (
    <BrowserRouter>
      <div className="container">
        <NavBar />
        <Routes>
          <Route element={<HomePage/>} path="/"/>
          <Route element={<CreateArticle/>} path="/create_article"/>
          <Route element={<MyArticles/>} path="/my_articles"/>
          <Route element={<Profile/>} path="/profile"/>
          <Route element={<Article/>} path="/article/:id"/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
