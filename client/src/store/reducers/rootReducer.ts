import { combineReducers } from 'redux'
import { articleReducer } from './ArticleReducer'
import { userReducer } from './UserReducer'

export const rootReducer = combineReducers({
  article: articleReducer,
  user: userReducer,
})

export type RootState = ReturnType<typeof rootReducer>
