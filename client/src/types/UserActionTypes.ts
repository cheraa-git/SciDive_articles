import { TEST } from "../store/actions/actionTypes";

export interface Itest {
  type: typeof TEST
  param: string
}

export type userActions = Itest