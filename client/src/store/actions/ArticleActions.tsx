import { NavigateFunction } from 'react-router-dom'
import axiosApp from '../../axios/axiosApp'
import { articleActions } from '../../types/ArticleTypes'
import { Article, CreateArticleData } from '../../types/interfaces'
import { CLEAR_ARTICLES, SET_CURRENT_CATEGORY, SET_MY_ARTICLES } from '../actionTypes'

export function fetchUserArticles(userName?: string) {
  return async (dispatch: any) => {
    dispatch(clearArticles())
    const token = localStorage.getItem('token')

    await axiosApp
      .get(`/user_articles/${userName}`)
      .then((res) => {
        if (res.data.error) console.log(res.data.error)
        else if (!res.data.error) {
          console.log(res.data)

          dispatch(setMyArticles(res.data))
        }
      })
      .catch((error) => console.log(error))
  }
}
export function fetchArticle(id: number) {
  return async (dispatch: any) => {
    dispatch(clearArticles())
    const token = localStorage.getItem('token')
    const response = await axiosApp.get(`/article/${id}?token=${token}`)
    const data = response.data
    console.log(data);
    
    dispatch(setMyArticles([data]))
  }
}
export function fetchSubscribe() {
  return async (dispatch: any) => {
    dispatch(clearArticles())
    const token = localStorage.getItem('token')
    const response = await axiosApp.get(`/tape?token=${token}`)
    const data = response.data
    console.log(data)
    dispatch(setMyArticles(data))
  }
}
export function fetchHome() {
  return async (dispatch: any) => {
    dispatch(clearArticles())
    const token = localStorage.getItem('token')
    const response = await axiosApp.get(`/main_page?token=${token}`)
    const data = response.data
    console.log(data)
    dispatch(setMyArticles(data))
  }
}

export function createArticle(postData: CreateArticleData, navigate: NavigateFunction) {
  return async (dispatch: any) => {
    const testData = {
      token: postData.token,
      title: postData.title,
      image: postData.sendAvatar,
      prev_content: '',
      content: postData.content,
      category: postData.category,
      tags: postData.tags,
    }
    const sendFormData = new FormData()
    if (postData.sendAvatar) {
      // sendFormData.append('image', '/image')
      sendFormData.append('image', postData.sendAvatar)
    }
    // sendFormData.append('image', postData.sendAvatar)
    sendFormData.append('token', postData.token!)
    sendFormData.append('title', postData.title)
    sendFormData.append('prev_content', postData.prevContent)
    sendFormData.append('content', postData.content)
    sendFormData.append('category', postData.category)
    sendFormData.append('tags', postData.tags)

    console.log('token: ', sendFormData.get('token'))
    console.log('title: ', sendFormData.get('title'))
    console.log('prev_content: ', sendFormData.get('prev_content'))
    console.log('content: ', sendFormData.get('content'))
    console.log('category: ', sendFormData.get('category'))
    console.log('tags: ', sendFormData.get('tags'))
    console.log('image: ', sendFormData.get('image'))
    try {
      const response = await axiosApp.post('/edit/article', sendFormData)
      const data = response.data
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }
}
//////////////////////////////////////////////////////////////////////////////////////
export function setMyArticles(articles: Article[]): articleActions {
  return {
    type: SET_MY_ARTICLES,
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
