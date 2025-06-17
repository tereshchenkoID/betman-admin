import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import settingsReducer from './reducers/settingsReducer'
import toastifyReducer from './reducers/toastifyReducer'
import asideReducer from './reducers/asideReducer'
import agentsReducer from './reducers/agentsReducer'
import authReducer from './reducers/authReducer'
import cmdReducer from './reducers/cmdReducer'

const allReducer = combineReducers({
  settings: settingsReducer,
  toastify: toastifyReducer,
  aside: asideReducer,
  agents: agentsReducer,
  auth: authReducer,
  cmd: cmdReducer,
})

const composeEnhancers =
  process.env.NODE_ENV !== 'production' &&
  typeof window !== 'undefined' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose
const middleware = applyMiddleware(thunk)
const store = createStore(allReducer, composeEnhancers(middleware))

export default store
