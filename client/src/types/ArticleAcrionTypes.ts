import { CLEAR_ARTICLES, SET_CURRENT_CATEGORY } from '../store/actions/actionTypes'

export interface IclearArticles {
  type: typeof CLEAR_ARTICLES
}
export interface IsetCurrentCategory {
  type: typeof SET_CURRENT_CATEGORY
  category: string
}
export type articleActions = IclearArticles | IsetCurrentCategory
