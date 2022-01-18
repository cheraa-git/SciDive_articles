import { combineReducers } from 'redux'
import { articleReducer } from './reducers/ArticleReducer'
import { authReducer } from './reducers/AuthReducer'
import { userReducer } from './reducers/UserReducer'

export const rootReducer = combineReducers({
  article: articleReducer,
  user: userReducer,
  auth: authReducer,
})

export type RootState = ReturnType<typeof rootReducer>
