import { LOGIN_USER, TEST } from "../store/actionTypes";

interface Itest {
  type: typeof TEST
}

interface IloginUser {
  type: typeof LOGIN_USER
  userAvatar: string
}

export type authAtcions = Itest | IloginUser