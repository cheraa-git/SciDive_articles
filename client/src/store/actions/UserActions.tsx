import axiosApp from '../../axios/axiosApp'
import { ProfilePayload, ProfileSubscribeItem } from '../../types/interfaces'
import { userActions } from '../../types/UserTypes'
import { FOLLOW, SET_PROFILE, SET_PROFLE_LOADING, START_PROFILE, UNFOLLOW } from '../actionTypes'

export function fetchProfile(login: string) {
  return async (dispatch: any) => {
    dispatch(startFetchProfile())
    try {
      const response = await axiosApp.get(`/profile/${login}?token=${localStorage.getItem('token')}`)
      const data = response.data

      dispatch(setProfile(data))
      console.log('profile data', data)
    } catch (e) {
      console.log('Error', e)
    }
  }
}

export function follow(id: number) {
  return async (dispatch: any) => {
    try {
      const response = await axiosApp.post(`/subscription/${id}?token=${localStorage.getItem('token')}`)
      if (!response.data.error) {
        console.log('SUBSCRIBE SUCCESS')
        dispatch(
          localFollow({ login: localStorage.getItem('userName')!, avatar: localStorage.getItem('avatar')!, blog_id: 0 })
        )
      } else {
        console.log('SUBSCRIBE ERROR')
      }
      console.log(response.data)
    } catch (e) {
      console.log('Error', e)
    }
  }
}

export function unfollow(id: number, login: string) {
  return async (dispatch: any) => {
    try {
      const response = await axiosApp.delete(`/subscription/${id}?token=${localStorage.getItem('token')}`)
      if (!response.data.error) {
        console.log('UNSUBSCRIBE SUCCESS')
        dispatch(localUnfollow(login))
      } else {
        console.log('UNSUBSCRIBE ERROR')
      }
      console.log(response.data)
    } catch (e) {
      console.log('Error', e)
    }
  }
}

export function authCheck(email: string, password: string) {
  return async (dispatch: any) => {
    try {
      const response = await axiosApp.post('authorization/log_in', { email, password })
      const data = response.data
      if (!data.error && data.token === localStorage.getItem('token')) {
        console.log('authCheck: ', data)
        return 'success'
      } else {
        console.log('authCheck Error: ', data)
        return 'failed'
      }
    } catch (e) {
      console.log('Error', e)
    }
  }
}

////////////////////////////////////////////////////////////

export function setProfileLoading(load: boolean): userActions {
  return {
    type: SET_PROFLE_LOADING,
    payload: load,
  }
}

export function setProfile(data: ProfilePayload): userActions {
  return {
    type: SET_PROFILE,
    payload: data,
  }
}

export function startFetchProfile(): userActions {
  return {
    type: START_PROFILE,
  }
}

export function localFollow(user: ProfileSubscribeItem): userActions {
  return {
    type: FOLLOW,
    payload: user,
  }
}
export function localUnfollow(userName: string): userActions {
  return {
    type: UNFOLLOW,
    payload: userName,
  }
}
