import { TEST } from "../store/actionTypes";

export interface Itest {
  type: typeof TEST
  param: string
}

export type userActions = Itest