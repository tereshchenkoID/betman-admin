import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import depositReducer from './reducers/depositReducer'
import withdrawalReducer from './reducers/withdrawalReducer'
import shopReducer from './reducers/shopReducer'
import playerReducer from './reducers/playerReducer'
import cashierReducer from './reducers/cashierReducer'
import playerInfoReducer from './reducers/playerInfoReducer'
import settingsReducer from './reducers/settingsReducer'
import toastifyReducer from './reducers/toastifyReducer'
import asideReducer from './reducers/asideReducer'
import authReducer from './reducers/authReducer'
import cmdReducer from './reducers/cmdReducer'

const allReducer = combineReducers({
  deposit: depositReducer,
  withdrawal: withdrawalReducer,
  shop: shopReducer,
  player: playerReducer,
  cashier: cashierReducer,
  playerInfo: playerInfoReducer,
  settings: settingsReducer,
  toastify: toastifyReducer,
  aside: asideReducer,
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
