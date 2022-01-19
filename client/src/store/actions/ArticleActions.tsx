import axiosApp from '../../axios/axiosApp'
import { articleActions } from '../../types/ArticleTypes'
import { Article } from '../../types/interfaces'
import { CLEAR_ARTICLES, SET_CURRENT_CATEGORY, SET_MY_ARTICLES } from '../actionTypes'
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

export function fetchMyArticles() {
  return async (dispatch: any) => {
    const token = localStorage.getItem('token')

    const response = await axiosApp.get(`/my_articles?token=${token}`)
    const data = response.data
    console.log(data)
    dispatch(setMyArticles(data))
  }
}
export function fetchArticle(id: number) {
  return async (dispatch: any) => {
    const token = localStorage.getItem('token')
    const response = await axiosApp.get(`/article/${id}?token=${token}`)
    const data = response.data
    dispatch(setMyArticles([data]))
  }
}
export function fetchSubscribe() {
  return async (dispatch: any) => {
    const token = localStorage.getItem('token')
    const response = await axiosApp.get(`/tape?token=${token}`)
    const data = response.data
    console.log(data)
    dispatch(setMyArticles(data))
  }
}
export function fetchHome() {
  return async (dispatch: any) => {
    const token = localStorage.getItem('token')
    const response = await axiosApp.get(`/main_page?token=${token}`)
    const data = response.data
    console.log(data)
    dispatch(setMyArticles(data))
  }
}

export function setMyArticles(articles: Article[]): articleActions {
  return {
    type: SET_MY_ARTICLES,
    articles,
  }
}
