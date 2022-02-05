import React from 'react'
import ReactDOM from 'react-dom'
import './index.sass'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import { rootReducer } from './store/rootReducer'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { SnackbarProvider } from 'notistack'

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))

const app = (
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <SnackbarProvider autoHideDuration={3000}>
          <App />
        </SnackbarProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)

ReactDOM.render(app, document.getElementById('root'))

reportWebVitals()
