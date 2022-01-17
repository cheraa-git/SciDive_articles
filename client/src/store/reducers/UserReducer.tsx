import { IUserInitialState } from '../../types/interfaces'
import { userActions } from '../../types/UserActionTypes'
import { TEST } from '../actions/actionTypes'

const initialState: IUserInitialState = {
  login: 'Alex',
  blogId: 2,
  subscribes: [1, 2, 4, 6, 7],
}

export function userReducer(state = initialState, action: userActions) {
  switch (action.type) {
    case TEST:
      return state
    default:
      return state
  }
}
