import { articleActions } from "../../types/ArticleAcrionTypes";
import { CLEAR_ARTICLES, TEST } from "./actionTypes";

export function test (param: string): articleActions {
  return {
    type: TEST,
    param
  }
}

export function clearArticles() {
  return{
    type: CLEAR_ARTICLES
  }
}