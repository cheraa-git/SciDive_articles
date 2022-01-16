import { articleActions } from "../../types/ArticleAcrionTypes";
import { TEST } from "./actionTypes";

export function test (param: string): articleActions {
  return {
    type: TEST,
    param
  }
}