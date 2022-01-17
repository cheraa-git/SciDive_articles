import { CLEAR_ARTICLES, SET_CURRENT_CATEGORY, SET_MY_ARTICLES } from '../store/actions/actionTypes'
import { Article } from './interfaces'

export interface IclearArticles {
  type: typeof CLEAR_ARTICLES
}
export interface IsetCurrentCategory {
  type: typeof SET_CURRENT_CATEGORY
  category: string
}

export interface IsetMyArticles {
  type: typeof SET_MY_ARTICLES
  articles: Article[]
}
export type articleActions = IclearArticles | IsetCurrentCategory | IsetMyArticles
