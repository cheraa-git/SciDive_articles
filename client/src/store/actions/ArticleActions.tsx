import { NavigateFunction } from 'react-router-dom'
import axiosApp from '../../axios/axiosApp'
import { articleActions } from '../../types/ArticleTypes'
import { Article, CreateArticleData } from '../../types/interfaces'
import { CLEAR_ARTICLES, SET_CURRENT_CATEGORY, SET_SEND_ARTICLE, SET_USER_ARTICLES } from '../actionTypes'

////////// FETCH DATA //////////
export function fetchUserArticles(userName?: string) {
  return async (dispatch: any) => {
    dispatch(clearArticles())

    await axiosApp
      .get(`/user_articles/${userName}`)
      .then((res) => {
        if (res.data.error) console.log(res.data.error)
        else if (!res.data.error) {
          console.log(res.data)

          dispatch(setUserArticles(res.data))
        }
      })
      .catch((error) => console.log(error))
  }
}
export function fetchArticle(id: number, edit?: boolean) {
  return async (dispatch: any) => {
    dispatch(clearArticles())
    const response = await axiosApp.get(`/article/${id}`)
    const data = response.data
    if (!data.error) {
      if (edit) {
        if (data.author.login === localStorage.getItem('userName')) {
          dispatch(setSendArticle(data))
        } else {
          console.log('NOT AUTHOR')
          document.location.href = '/create_article'
        }
      } else {
        dispatch(setUserArticles([data]))
      }
      console.log(data)
    } else console.log('Error', data)
  }
}

export function fetchSubscribe() {
  return async (dispatch: any) => {
    dispatch(clearArticles())
    const token = localStorage.getItem('token')
    const response = await axiosApp.get(`/tape?token=${token}`)
    const data = response.data
    dispatch(setUserArticles(data))
    console.log(data)
  }
}
export function fetchHome() {
  return async (dispatch: any) => {
    dispatch(clearArticles())
    const token = localStorage.getItem('token')
    const response = await axiosApp.get(`/main_page?token=${token}`)
    const data = response.data
    console.log(data)
    dispatch(setUserArticles(data))
  }
}

////////// ARTICLE  //////////
export function createArticle(postData: CreateArticleData, navigate: NavigateFunction) {
  return async (dispatch: any) => {
    const sendFormData = new FormData()
    if (postData.sendAvatar) {
      sendFormData.append('image', postData.sendAvatar)
    }
    sendFormData.append('token', postData.token!)
    sendFormData.append('title', postData.title)
    sendFormData.append('prev_content', postData.prevContent)
    sendFormData.append('content', postData.content)
    sendFormData.append('category', postData.category)
    sendFormData.append('tags', postData.tags)

    try {
      const response = await axiosApp.post('/edit/article', sendFormData)
      const data = response.data
      if (!data.error) {
        navigate(-1)
        console.log(data)
        dispatch(clearArticles())
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export function editArticle(postData: CreateArticleData, navigate: NavigateFunction) {
  return async (dispatch: any) => {
    const sendFormData = new FormData()
    if (postData.sendAvatar) {
      sendFormData.append('image', postData.sendAvatar)
    }
    sendFormData.append('token', postData.token!)
    sendFormData.append('title', postData.title)
    sendFormData.append('prev_content', postData.prevContent)
    sendFormData.append('content', postData.content)
    sendFormData.append('category', postData.category)
    sendFormData.append('tags', postData.tags)

    try {
      const response = await axiosApp.put(`/edit/article/${postData.id}`, sendFormData)
      const data = response.data
      if (!data.error) {
        navigate(-1)
        dispatch(clearArticles())
      }
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }
}

export function deleteArticle(id: number, navigate: NavigateFunction, snachbar: any) {
  return async (dispatch: any) => {
    try {
      const response = await axiosApp.delete(`/article/${id}?token=${localStorage.getItem('token')}`)
      if (!response.data.error) {
        navigate(-1)
        snachbar('Статья удалена')
      }
      console.log(response.data)
    } catch (e) {
      console.log(e)
    }
  }
}

////////// OTHER //////////
export function addView(id: number) {
  return async (dispatch: any) => {
    try {
      const response = await axiosApp.get(`/plus/view/${id}?token=${localStorage.getItem('token')}`)
      if (!response.data.error) {
        console.log('view', response.data)
      } else {
        console.log('view', response.data)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

//////////////////////////////////////////////////////////////////////////////////////

export function setUserArticles(articles: Article[]): articleActions {
  return {
    type: SET_USER_ARTICLES,
    articles,
  }
}

export function clearArticles(): articleActions {
  return {
    type: CLEAR_ARTICLES,
  }
}

export function setCurrentCategory(category: string): articleActions {
  return {
    type: SET_CURRENT_CATEGORY,
    category,
  }
}

export function setSendArticle(article: Article): articleActions {
  return {
    type: SET_SEND_ARTICLE,
    article,
  }
}
