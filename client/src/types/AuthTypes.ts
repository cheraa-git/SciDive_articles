import { AUTO_AUTH_SUCCESS, LOGIN_USER, LOGOUT_USER, TEST } from '../store/actionTypes'

interface IloginUser {
  type: typeof LOGIN_USER
  userAvatar: string
  token: string
}

interface IlogoutUser {
  type: typeof LOGOUT_USER
}

interface IautoAuthSuccess {
  type: typeof AUTO_AUTH_SUCCESS
  token: string
}

export type authAtcions = IloginUser | IlogoutUser | IautoAuthSuccess
