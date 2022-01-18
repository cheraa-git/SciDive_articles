import { userActions } from '../../types/UserTypes'
import { TEST } from '../actionTypes'

interface IUserInitialState {
  login: string
  blog_id: number
  subscribes: number[]
  avatar?: string
}
const initialState: IUserInitialState = {
  login: 'Alex',
  blog_id: 2,
  subscribes: [1, 2, 4, 6, 7],
  avatar: '',
}

export function userReducer(state = initialState, action: userActions) {
  switch (action.type) {
    case TEST:
      return state
    default:
      return state
  }
}
