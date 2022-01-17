import { staticArticles } from '../../staticArticles'
import { articleActions } from '../../types/ArticleAcrionTypes'
import { Article } from '../../types/interfaces'
import { CLEAR_ARTICLES, SET_CURRENT_CATEGORY } from '../actions/actionTypes'

interface IArticleInitialState {
  articles: Article[]
  currentCategory: string
  categoryList: string[]
}
const initialState: IArticleInitialState = {
  articles: staticArticles,
  currentCategory: 'Все категории',
  categoryList: ['Все категории', 'Разработка', 'Администрирование', 'Менеджмент', 'Финансы'],
}

export function articleReducer(state = initialState, action: articleActions) {
  switch (action.type) {
    case CLEAR_ARTICLES:
      return { ...state, articles: [] }
    case SET_CURRENT_CATEGORY:
      return {...state, currentCategory: action.category}
    default:
      return state
  }
}
