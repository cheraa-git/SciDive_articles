import { userActions } from "../../types/UserActionTypes";
import { TEST } from "./actionTypes";

export function test (param: string): userActions {
  return {
    type: TEST,
    param
  }
}