import { authAtcions } from '../../types/AuthTypes'
import { LOGIN_USER } from '../actionTypes'

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
      }
    default:
      return state
  }
}
