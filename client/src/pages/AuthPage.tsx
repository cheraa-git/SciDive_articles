import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { postRegisterData } from '../store/actions/AuthActions'

export const AuthPage: React.FC = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    // dispatch(authDataPost({login: 'Alex', password: '111111'}))
    // dispatch(postRegisterData({login: 'User1', password: '111111', email: 'User1@mail.ru'}))
  }, [dispatch])

  return (
    <div>
      <h1>AuthPage</h1>
    </div>
  )
}
