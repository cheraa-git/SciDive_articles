import axiosApp from '../../axios/axiosApp'
import { authAtcions } from '../../types/AuthTypes'
import { userActions } from '../../types/UserTypes'
import { AUTO_AUTH_SUCCESS, LOGIN_USER, LOGOUT_USER } from '../actionTypes'

export const postRegisterData = (data: Object, props?: any) => {
  return async (dispatch: any) => {
    await axiosApp.post('authorization/sign_up', data).then((res) => {
      if (res.data.error) {
        // dispatch( registerError(true) )
        // dispatch( logRegisterMassage("Такой пользователь или email уже есть в системе") )
        console.log('ERROR', res.data.error)
      } else {
        console.log(res.data)

        // const authData = { login: data.login, password: data.password }
        // dispatch( logRegisterMassage(null) )
        // dispatch( authDataPost(authData, props) )
        // props.history.push("/")
      }
    })
  }
}

export const authDataPost = (userData: any, navigate: any) => {
  return async (dispatch: any) => {
    console.log('authDataPost')
    await axiosApp
      .post('authorization/log_in', userData)
      .then((res) => {
        if (res.data.error) {
          console.log('Неверный логин или пароль')
        } else if (!res.data.error) {
          console.log('auth data', res.data)
          dispatch(loginUser(res.data.avatar, res.data.token))

          const expirationDate = new Date(new Date().getTime() + 3600000)

          localStorage.setItem('token', res.data.token)
          localStorage.setItem('expirationDate', JSON.stringify(expirationDate))
          localStorage.setItem('userName', userData.login)
          localStorage.setItem('userAvatar', res.data.avatar)
          navigate('/')
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}

export function autoLogin(navigate: any) {
  return (dispatch: any) => {
    const token = localStorage.getItem('token')
    if (!token) {
      dispatch(logoutUser())
      // navigate('/')
    } else {
      const expirationDate = new Date(JSON.stringify(localStorage.getItem('expirationDate')))
      if (expirationDate <= new Date()) {
        dispatch(logoutUser())
        // navigate('/')
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
    token
  }
}
