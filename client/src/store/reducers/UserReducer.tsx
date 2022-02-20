import { ProfileSubscribeItem } from '../../types/interfaces'
import { userActions } from '../../types/UserTypes'
import { FOLLOW, SET_PROFILE, SET_PROFLE_LOADING, START_PROFILE, UNFOLLOW } from '../actionTypes'

interface IUserInitialState {
  login: string
  blog_id: number
  subscribers: ProfileSubscribeItem[]
  subscriptions: ProfileSubscribeItem[]
  avatar?: string
  isProfileEdit: boolean
  loading: boolean
}
const initialState: IUserInitialState = {
  login: '',
  blog_id: 0,
  subscribers: [],
  subscriptions: [],
  avatar: '',
  isProfileEdit: false,
  loading: false,
}

export function userReducer(state = initialState, action: userActions) {
  switch (action.type) {
    case SET_PROFILE:
      return { ...state, ...action.payload, loading: false }
    case START_PROFILE:
      return { ...state, login: '', subscribers: [], subscriptions: [], avatar: '', loading: true, blog_id: 0 }

    case SET_PROFLE_LOADING:
      return { ...state, loading: action.payload }

    case FOLLOW:
      const newSubscribers = state.subscribers
      newSubscribers.push(action.payload)
      return { ...state, subscribers: newSubscribers }
    case UNFOLLOW:

      const newSubscribers2 = state.subscribers.filter((el) => el.login !== action.payload)
      console.log('payload', action.payload)
      
      console.log('newSubscribers2', newSubscribers2)
      
      return { ...state, subscribers: newSubscribers2 }
    default:
      return state
  }
}
