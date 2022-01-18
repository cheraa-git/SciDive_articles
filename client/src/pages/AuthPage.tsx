import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

export const AuthPage: React.FC = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    // dispatch(authDataPost({login: 'Alex', password: '111111'}))
    // dispatch(postRegisterData({login: 'Alex', password: '111111', email: 'Alex@mail.ru'}))
  }, [dispatch])

  return (
    <div>
      <h1>AuthPage</h1>
    </div>
  )
}
