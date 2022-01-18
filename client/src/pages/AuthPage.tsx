import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

export const AuthPage: React.FC = () => {
  const dispatch = useDispatch()
  const [password, setPassword] = useState<null | HTMLElement>()
  const [login, setLogin] = useState('')

  useEffect(() => {
    // dispatch(authDataPost({login: 'Alex', password: '111111'}))
    // dispatch(postRegisterData({login: 'Alex', password: '111111', email: 'Alex@mail.ru'}))
  }, [dispatch])

  const loginHandler = () => {

  }

  const submitHandler = () => {
    console.log('submit')
  }

  return (
    <div className="container">
      <div className="bg-opacity-10 mx-auto border p-4" style={{ width: '60%', minWidth: '21rem' }}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Логин
          </label>
          <input className="form-control" value={login} onChange={loginHandler} />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Пароль
          </label>
          <input type="password" className="form-control" id="exampleInputPassword1" />
        </div>
        <button className="btn btn-primary" onClick={submitHandler}>
          Войти
        </button>
      </div>
    </div>
  )
}
