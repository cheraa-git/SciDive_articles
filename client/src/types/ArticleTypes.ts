import {
  ARTICLE_ERROR,
  ARTICLE_SEARCH,
  CLEAR_ARTICLES,
  SET_CURRENT_CATEGORY,
  SET_SEND_ARTICLE,
  SET_USER_ARTICLES,
} from '../store/actionTypes'
import { Article } from './interfaces'

interface IclearArticles {
  type: typeof CLEAR_ARTICLES
}
interface IsetCurrentCategory {
  type: typeof SET_CURRENT_CATEGORY
  category: string
}

interface IsetMyArticles {
  type: typeof SET_USER_ARTICLES
  articles: Article[]
}

interface IsetEditArticle {
  type: typeof SET_SEND_ARTICLE
  article: Article
}

interface IarticleError {
  type: typeof ARTICLE_ERROR
  payload: boolean
}

interface IarticleSearch {
  type: typeof ARTICLE_SEARCH
  payload: string
}

export type articleActions =
  | IclearArticles
  | IsetCurrentCategory
  | IsetMyArticles
  | IsetEditArticle
  | IarticleError
  | IarticleSearch
