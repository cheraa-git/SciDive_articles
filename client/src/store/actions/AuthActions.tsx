import axiosApp from '../../axios/axiosApp'
import { authAtcions } from '../../types/AuthTypes'
import { AUTO_AUTH_SUCCESS, LOGIN_USER, LOGOUT_USER } from '../actionTypes'

export const postRegisterData = (data: any, navigate: any, snackbar: any) => {
  return async (dispatch: any) => {
    await axiosApp.post('authorization/sign_up', data).then((res) => {
      if (res.data.error) {
        switch (res.data.error) {
          case 'SignupEmailError':
            return snackbar('Аккаунт с таким E-mail уже зарегестрирован')
          case 'SignupLoginError':
            return snackbar('Данный никнейм занят')
          default:
            console.log('ERROR', res.data.error)
        }
      } else if (!res.data.error) {
        console.log('signup success', res.data)
        const authData = { email: data.email, password: data.password }
        dispatch(authDataPost(authData, snackbar))
      }
    })
  }
}

export const authDataPost = (userData: any, snackbar: any) => {
  return async (dispatch: any) => {
    console.log('authDataPost')
    await axiosApp
      .post('authorization/log_in', userData)
      .then((res) => {
        if (res.data.error) {
          snackbar('Неверный логин или пароль', { variant: 'warning' })
          console.log('Неверный логин или пароль')
        } else if (!res.data.error) {
          console.log('auth data', res.data)
          dispatch(loginUser(res.data.avatar, res.data.token))

          const expirationDate = new Date(new Date().getTime() + 3600000)

          localStorage.setItem('token', res.data.token)
          localStorage.setItem('expirationDate', JSON.stringify(expirationDate))
          localStorage.setItem('userAvatar', res.data.avatar)
          localStorage.setItem('userName', res.data.login)
          document.location.href = '/'
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}

export function autoLogin() {
  return (dispatch: any) => {
    const token = localStorage.getItem('token')
    if (!token) {
      dispatch(logoutUser())
    } else {
      const expirationDate = new Date(JSON.stringify(localStorage.getItem('expirationDate')))
      if (expirationDate <= new Date()) {
        dispatch(logoutUser())
      } else {
        dispatch(autoAuthSuccess(token))
      }
    }
  }
}

export function logoutUser(): authAtcions {
  localStorage.removeItem('token')
  localStorage.removeItem('expirationDate')
  localStorage.removeItem('userAvatar')
  localStorage.removeItem('userName')
  return {
    type: LOGOUT_USER,
  }
}

export function autoAuthSuccess(token: string): authAtcions {
  return {
    type: AUTO_AUTH_SUCCESS,
    token,
  }
}

export function loginUser(userAvatar: string, token: string): authAtcions {
  return {
    type: LOGIN_USER,
    userAvatar,
    token,
  }
}
