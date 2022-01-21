import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { authDataPost, postRegisterData } from '../store/actions/AuthActions'

export const AuthPage: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [login, setLogin] = useState('')
  const { mode } = useParams()

  // useEffect(() => {
  //   // dispatch(authDataPost({login: 'Alex', password: '111111'}))
  //   // dispatch(postRegisterData({login: 'User1', password: '111111', email: 'User1@mail.ru'}))
  // }, [dispatch])

  const loginHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLogin(event.target.value)
  }
  const passwordHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const submitHandler = () => {
    dispatch(authDataPost({ login, password }, navigate))
  }

  let content = null
  if (mode === 'login') {
    content = (
      <>
        <h2>Вход</h2>
        <div className="mb-3">
          <label className="form-label">Логин</label>
          <input className="form-control" value={login} onChange={loginHandler} />
        </div>

        <div className="mb-3">
          <label className="form-label">Пароль</label>
          <input type="password" className="form-control" value={password} onChange={passwordHandler} />
        </div>

        <button className="btn btn-primary" onClick={submitHandler}>
          Войти
        </button>
      </>
    )
  } else if (mode === 'singup') {
    content = (
      <form>
        <h2>Регистрация</h2>

        <div className="mb-3">
          <label className="form-label">E-mail</label>
          <input type="email" className="form-control" required />
        </div>

        <div className="mb-3">
          <label className="form-label">Никнейм</label>
          <input className="form-control" value={login} onChange={loginHandler} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Пароль</label>
          <input type="password" className="form-control" value={password} onChange={passwordHandler} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Пароль еще раз</label>
          <input type="password" className="form-control" value={password} onChange={passwordHandler} required />
        </div>

        <button className="btn btn-primary">Войти</button>
      </form>
    )
  }

  return (
    <div className="container">
      <div className="bg-opacity-10 mx-auto border p-4" style={{ width: '60%', minWidth: '21rem' }}>
        {content}
      </div>
    </div>
  )
}
