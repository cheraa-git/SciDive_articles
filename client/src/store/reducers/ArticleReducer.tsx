import { staticArticles } from '../../staticArticles'
import { articleActions } from '../../types/ArticleTypes'
import { Article } from '../../types/interfaces'
import { CLEAR_ARTICLES, SET_CURRENT_CATEGORY, SET_MY_ARTICLES } from '../actionTypes'

interface IArticleInitialState {
  articles: Article[]
  currentCategory: string
  categoryList: string[]
}
const initialState: IArticleInitialState = {
  articles: [],
  currentCategory: 'Все категории',
  categoryList: ['Все категории', 'Разработка', 'Администрирование', 'Менеджмент', 'Финансы'],
}

export function articleReducer(state = initialState, action: articleActions) {
  switch (action.type) {
    case CLEAR_ARTICLES:
      return { ...state, articles: [] }
    case SET_CURRENT_CATEGORY:
      return {...state, currentCategory: action.category}
    case SET_MY_ARTICLES: 
      return {...state, articles: action.articles}  
    default:
      return state
  }
}
