import { articleActions } from '../../types/ArticleTypes'
import { Article, Search } from '../../types/interfaces'
import {
  ARTICLE_ERROR,
  ARTICLE_SEARCH,
  CLEAR_ARTICLES,
  SET_CURRENT_CATEGORY,
  SET_SEND_ARTICLE,
  SET_USER_ARTICLES,
} from '../actionTypes'

interface IArticleInitialState {
  articles: Article[]
  currentCategory: string
  categoryList: string[]
  sendArticle: Article
  loading: boolean
  error: boolean
  search: Search
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
  error: false,
  search: {
    request: '',
    title: true,
    tags: false,
    content: false,
  },
}

export function articleReducer(state = initialState, action: articleActions) {
  switch (action.type) {
    case CLEAR_ARTICLES:
      return { ...state, articles: [], loading: true, sendArticle: initialState.sendArticle }
    case SET_CURRENT_CATEGORY:
      return { ...state, currentCategory: action.category }
    case SET_USER_ARTICLES:
      action.articles.forEach(art => {
        if (art.tags && typeof art.tags === 'string') {
          art.tags = JSON.parse(art.tags)
        }
      })

      return {
        ...state,
        articles: action.articles,
        loading: false,
      }
    case SET_SEND_ARTICLE:
      if (action.article.tags && typeof action.article.tags === 'string') {
        action.article.tags = JSON.parse(action.article.tags)
      }
      return { ...state, sendArticle: action.article, loading: false }
    case ARTICLE_ERROR:
      return { ...state, error: action.payload }
    case ARTICLE_SEARCH:
      if (!action.payload) {
        action.payload = initialState.search
      }
      return { ...state, search: { ...state.search, ...action.payload } }
    default:
      return state
  }
}
