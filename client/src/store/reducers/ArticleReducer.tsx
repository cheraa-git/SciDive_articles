import { articleActions } from '../../types/ArticleTypes'
import { Article } from '../../types/interfaces'
import { CLEAR_ARTICLES, SET_CURRENT_CATEGORY, SET_SEND_ARTICLE, SET_USER_ARTICLES } from '../actionTypes'

interface IArticleInitialState {
  articles: Article[]
  currentCategory: string
  categoryList: string[]
  sendArticle: Article
  loading: boolean
}
const initialState: IArticleInitialState = {
  articles: [],
  currentCategory: 'Все категории',
  categoryList: ['Все категории', 'Разработка', 'Администрирование', 'Менеджмент', 'Финансы'],
  sendArticle: {
    id: 0,
    blog_id: 0,
    date: '',
    views: 0,
    title: '',
    content: '',
    image: '',
    category: '',
    prev_content: '',
    author: {
      login: '',
      avatar: '',
    },
  },
  loading: false,
}

export function articleReducer(state = initialState, action: articleActions) {
  switch (action.type) {
    case CLEAR_ARTICLES:
      return { ...state, articles: [], loading: true, sendArticle: initialState.sendArticle }
    case SET_CURRENT_CATEGORY:
      return { ...state, currentCategory: action.category }
    case SET_USER_ARTICLES:
      return { ...state, articles: action.articles, loading: false }
    case SET_SEND_ARTICLE:
      return { ...state, sendArticle: action.article, loading: false }
    default:
      return state
  }
}
