import { NavigateFunction } from 'react-router-dom'
import axiosApp from '../../axios/axiosApp'
import { EditProfileSendData, ProfilePayload, ProfileSubscribeItem } from '../../types/interfaces'
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

export function authCheck(email: string, password: string, mode?: string) {
  return async (dispatch: any) => {
    const sendData: any = { email, password }
    if (mode === 'edit') {
      sendData['forAction'] = 'change'
    }
    try {
      const response = await axiosApp.post('authorization/log_in', sendData)
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

export function editProfile(sendData: EditProfileSendData, snackbar: any) {
  return async (dispatch: any) => {
    const formData = new FormData()
    let key: keyof typeof sendData

    if (sendData) {
      for (key in sendData) {
        formData.append(key, sendData[key]!)
      }
    }

    try {
      const response = await axiosApp.post(`/edit_profile?token=${localStorage.getItem('token')}`, formData)
      const data = response.data
      if (!data.error) {
        console.log('Edit profile success: ', data)

        if (data.newLogin) {
          localStorage.setItem('userName', data.newLogin)
          document.location.href = `/profile`
        }

        if (data.newImage) {
          localStorage.setItem('userAvatar', data.newImage)
          document.location.href = `/profile`
        }

        if (data.newEmail) {
          document.location.href = `/profile`
        }

        if (data.newPassword) {
          document.location.href = `/profile`
        }

        return 'success'
      } else {
        console.log('Edit profile faild: ', data)
        return 'failed'
      }
    } catch (e) {
      console.log('Error', e)
    }
  }
}

export function deleteProfile(forgotCode: string, snackbar: any) {
  return async (dispatch: any) => {
    try {
      const response = await axiosApp.post(`/delete_profile?token=${localStorage.getItem('token')}`, { forgotCode })
      const data = response.data
      if (!data.error) {
        snackbar('Успешно', { variant: 'success' })
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
