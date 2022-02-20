import { FOLLOW, SET_PROFILE, SET_PROFLE_LOADING, START_PROFILE, TEST, UNFOLLOW } from '../store/actionTypes'
import { ProfilePayload, ProfileSubscribeItem } from './interfaces'

export interface IsetProfile {
  type: typeof SET_PROFILE
  payload: ProfilePayload
}

export interface IsetProfileLoading {
  type: typeof SET_PROFLE_LOADING
  payload: boolean
}

export interface IstartFetchProfile {
  type: typeof START_PROFILE
}

export interface IlocalFollow {
  type: typeof FOLLOW
  payload: ProfileSubscribeItem
}
export interface IlocalUnfollow {
  type: typeof UNFOLLOW
  payload: string
}

export type userActions = IsetProfile | IsetProfileLoading | IstartFetchProfile | IlocalFollow | IlocalUnfollow
