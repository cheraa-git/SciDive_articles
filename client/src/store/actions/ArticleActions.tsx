import { articleActions } from '../../types/ArticleAcrionTypes'
import { CLEAR_ARTICLES, SET_CURRENT_CATEGORY } from './actionTypes'

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
