import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'

import './i18n'

import './scss/app.scss'

import reportWebVitals from './reportWebVitals'

import store from './store'

import { router } from './router'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
)

reportWebVitals()
