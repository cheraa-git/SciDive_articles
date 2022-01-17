import { userActions } from '../../types/UserActionTypes'
import { TEST } from '../actions/actionTypes'

interface IUserInitialState {
  login: string
  blogId: number
  subscribes: number[]
  avatar?: string
}
const initialState: IUserInitialState = {
  login: 'Alex',
  blogId: 2,
  subscribes: [1, 2, 4, 6, 7],
  avatar: ''
}

export function userReducer(state = initialState, action: userActions) {
  switch (action.type) {
    case TEST:
      return state
    default:
      return state
  }
}
