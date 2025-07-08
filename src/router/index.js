import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import App from '../App'
import Loader from 'components/Loader'

const Dashboard = lazy(() => import('pages/Dashboard'))
const Login = lazy(() => import('pages/Login'))
const Settings = lazy(() => import('pages/Settings'))
const Accounts = lazy(() => import('pages/Accounts'))
const Reports = lazy(() => import('pages/Reports'))
const History = lazy(() => import('pages/History'))
const Financial = lazy(() => import('pages/Financial'))

const withSuspense = (Component) => (
  <Suspense fallback={<Loader />}>
    <Component />
  </Suspense>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: withSuspense(Dashboard) },
      { path: 'accounts', element: withSuspense(Accounts) },
      { path: 'login', element: withSuspense(Login) },
      { path: 'players', element: withSuspense(Dashboard) },
      { path: 'reports', element: withSuspense(Reports) },
      { path: 'history', element: withSuspense(History) },
      { path: 'financial', element: withSuspense(Financial) },
      { path: 'accounts', element: withSuspense(Accounts) },
      { path: 'settings', element: withSuspense(Settings) },
    ],
  },
])
