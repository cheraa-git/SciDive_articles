import { articleActions } from '../../types/ArticleAcrionTypes'
import { IArticleInitialState } from '../../types/ArticleInterfaces'
import { TEST } from '../actions/actionTypes'

const initialState: IArticleInitialState = {
  articles: [],
}

export function articleReducer(state = initialState, action: articleActions) {
  switch (action.type) {
    case TEST:
      return state
    default:
      return state
  }
}
