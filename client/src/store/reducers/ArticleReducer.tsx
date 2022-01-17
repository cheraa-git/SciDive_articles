import { staticArticles } from '../../staticArticles'
import { articleActions } from '../../types/ArticleAcrionTypes'
import { IArticleInitialState } from '../../types/interfaces'
import { CLEAR_ARTICLES, TEST } from '../actions/actionTypes'

const initialState: IArticleInitialState = {
  articles: staticArticles,
}

export function articleReducer(state = initialState, action: articleActions) {
  switch (action.type) {
    case TEST:
      return state
    case CLEAR_ARTICLES:
      return { ...state, articles: [] }
    default:
      return state
  }
}
