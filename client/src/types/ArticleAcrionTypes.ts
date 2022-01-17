import { CLEAR_ARTICLES, TEST } from '../store/actions/actionTypes'

export interface Itest {
  type: typeof TEST
  param: string
}

export interface IclearArticles {
  type: typeof CLEAR_ARTICLES
}

export type articleActions = Itest | IclearArticles
