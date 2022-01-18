import { CLEAR_ARTICLES, SET_CURRENT_CATEGORY, SET_MY_ARTICLES } from '../store/actionTypes'
import { Article } from './interfaces'

interface IclearArticles {
  type: typeof CLEAR_ARTICLES
}
 interface IsetCurrentCategory {
  type: typeof SET_CURRENT_CATEGORY
  category: string
}

interface IsetMyArticles {
  type: typeof SET_MY_ARTICLES
  articles: Article[]
}
export type articleActions = IclearArticles | IsetCurrentCategory | IsetMyArticles
