import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { authDataPost, postRegisterData } from '../store/actions/AuthActions'
import { useSnackbar } from 'notistack'

export const AuthPage: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { enqueueSnackbar: snackbar } = useSnackbar()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')
  const [login, setLogin] = useState('')
  const [valid, setValid] = useState({ email: '', login: '', password: '', secondPassword: '' })
  const { mode } = useParams()

  const inputHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    func: React.Dispatch<React.SetStateAction<string>>
  ) => func(event.target.value)

  const loginHandler = () => {
    dispatch(authDataPost({ email, password }, navigate, snackbar))
  }

  const singupHandler = () => {
    setValid({ ...valid, email: '', login: '', password: '', secondPassword: '' })
    if (
      password.length >= 6 &&
      login.match(/^[a-zA-Z0-9]{3,16}$/) &&
      email.match(/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i)
    ) {
      if (password === confirmPassword) {
        dispatch(postRegisterData({ login, password, email }, navigate, snackbar))
        console.log('success')
      } else {
        setValid((prev) => ({ ...prev, secondPassword: 'invalid' }))
      }
    }
    if (password.length < 6) {
      setValid((prev) => ({ ...prev, password: 'invalid' }))
    }
    if (!login.match(/^[a-zA-Z0-9]{3,16}$/)) {
      setValid((prev) => ({ ...prev, login: 'invalid' }))
    }
    if (!email.match(/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i)) {
      setValid((prev) => ({ ...prev, email: 'invalid' }))
    }
  }

  let content = null
  if (mode === 'login' || !mode) {
    content = (
      <>
        <h1 className="display-6">Вход</h1>
        <div className="mb-3">
          <label className="lead form-label">E-mail</label>
          <input className="form-control" value={email} onChange={(e) => inputHandler(e, setEmail)} required />
        </div>

        <div className="mb-3">
          <label className="lead form-label">Пароль</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => inputHandler(e, setPassword)}
            minLength={6}
            required
          />
        </div>
        <button className="btn btn-primary" onClick={loginHandler}>
          Войти
        </button>
        <p className="lead mb-0">
          Еще нет аккаунта?{' '}
          <NavLink className="text-decoration-none" to="/auth/signup">
            Зарегестрируйтесь.
          </NavLink>
        </p>
      </>
    )
  } else if (mode === 'signup') {
    content = (
      <>
        <h2 className="display-6">Регистрация</h2>

        <div className="mb-3">
          <label className="form-label lead">E-mail</label>
          <input
            type="email"
            className={`form-control is-${valid.email}`}
            value={email}
            onChange={(e) => inputHandler(e, setEmail)}
            required
          />
          <div className="invalid-feedback">Некорректный E-mail</div>
        </div>

        <div className="mb-3">
          <label className="form-label lead">Никнейм</label>
          <input
            className={`form-control is-${valid.login}`}
            value={login}
            onChange={(e) => inputHandler(e, setLogin)}
            required
          />
          <div className="invalid-feedback">
            Только буквы (A-Z a-z) и цифры (0-9), не меньше 3 и не больше 25 символов
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label lead">Пароль</label>
          <input
            type="password"
            className={`form-control is-${valid.password}`}
            value={password}
            onChange={(e) => inputHandler(e, setPassword)}
            required
            minLength={6}
          />
          <div className="invalid-feedback">Не менее 6 символов</div>
        </div>

        <div className="mb-3">
          <label className="form-label lead">Пароль еще раз</label>
          <input
            type="password"
            className={`form-control is-${valid.secondPassword}`}
            value={confirmPassword}
            onChange={(e) => inputHandler(e, setConfirmPassword)}
            required
            minLength={6}
          />
          <div className="invalid-feedback">Пароли не совпадают</div>
        </div>

        <button className="btn btn-primary" onClick={singupHandler}>
          Зарегестрироваться
        </button>
        <p className="lead mb-0">
          Уже есть аккаунт?{' '}
          <NavLink className="text-decoration-none" to="/auth/login">
            Войдите
          </NavLink>{' '}
        </p>
      </>
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
