import { authAtcions } from '../../types/AuthTypes'
import { AUTO_AUTH_SUCCESS, LOGIN_USER, LOGOUT_USER } from '../actionTypes'

interface AuthInitialState {
  isAuth: boolean
  userAvatar: string
  token: string
}

const initialState: AuthInitialState = {
  isAuth: false,
  userAvatar: '',
  token: '',
}

export function authReducer(state = initialState, action: authAtcions) {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        isAuth: true,
        userAvatar: action.userAvatar,
        token: action.token,
      }
    case LOGOUT_USER:
      return { ...state, isAuth: false, token: null }
    case AUTO_AUTH_SUCCESS:
      return { ...state, isAuth: true, token: action.token }
    default:
      return state
  }
}
