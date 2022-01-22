import axiosApp from '../../axios/axiosApp'
import { articleActions } from '../../types/ArticleTypes'
import { Article } from '../../types/interfaces'
import { CLEAR_ARTICLES, SET_CURRENT_CATEGORY, SET_MY_ARTICLES } from '../actionTypes'

export function fetchMyArticles() {
  return async (dispatch: any) => {
    dispatch(clearArticles())
    const token = localStorage.getItem('token')

    await axiosApp
      .get(`/my_articles?token=${token}`)
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
