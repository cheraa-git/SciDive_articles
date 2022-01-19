import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { authDataPost, postRegisterData } from '../store/actions/AuthActions'

export const AuthPage: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [login, setLogin] = useState('')

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
    // dispatch(authDataPost({ login: 'Alex', password: '111111' }))
  }

  return (
    <div className="container">
      <div className="bg-opacity-10 mx-auto border p-4" style={{ width: '60%', minWidth: '21rem' }}>
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
      </div>
    </div>
  )
}
