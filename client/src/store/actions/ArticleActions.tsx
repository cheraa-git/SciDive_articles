import axiosApp from '../../axios/axiosApp'
import { articleActions } from '../../types/ArticleAcrionTypes'
import { Article } from '../../types/interfaces'
import { CLEAR_ARTICLES, SET_CURRENT_CATEGORY, SET_MY_ARTICLES } from './actionTypes'
const token = '?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpbiI6MX0._6J5Yzv2a4JEXHOLOSvVf1kkyPsDCfbkkatcaq_uios'
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
    const response = await axiosApp.get('/blog/1' + token)
    const data = response.data
    console.log(data);
    dispatch(setMyArticles(data))

    
  }
}
export function fetchArticle(id: number) {
  return async (dispatch: any) => {
    const response = await axiosApp.get(`/article/${id}${token}`)
    const data = response.data
    dispatch(setMyArticles([data]))
    
  }
}
export function fetchSubscribe() {
  return async (dispatch: any) => {
    const response = await axiosApp.get(`/tape${token}`)
    const data = response.data
    console.log(data);
    
    dispatch(setMyArticles(data))
    
  }
}

export function setMyArticles(articles: Article[]): articleActions {
  return {
    type: SET_MY_ARTICLES,
    articles
  }
}
