import axiosApp from '../../axios/axiosApp'
import { userActions } from '../../types/UserTypes'

export function fetchProfile(login: string) {
  return async (dispatch: any) => {
    try {
      const response = await axiosApp.get(`/profile/${login}`)
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
      } else {
        console.log('SUBSCRIBE ERROR')
      }
      console.log(response.data)
    } catch (e) {
      console.log('Error', e)
    }
  }
}

export function unfollow(id: number) {
  return async (dispatch: any) => {
    try {
      const response = await axiosApp.delete(`/subscription/${id}?token=${localStorage.getItem('token')}`)
      if (!response.data.error) {
        console.log('UNSUBSCRIBE SUCCESS')
      } else {
        console.log('UNSUBSCRIBE ERROR')
      }
      console.log(response.data)
    } catch (e) {
      console.log('Error', e)
    }
  }
}
