import React, { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { NAVIGATION } from '../constant/config'

import App from 'App'
import Loader from 'components/Loader'
import ProtectedRoute from './ProtectedRoute'

const Agents = lazy(() => import('pages/Agents'))
const Shops = lazy(() => import('pages/Shops'))
const Players = lazy(() => import('pages/Players'))
const Cashiers = lazy(() => import('pages/Cashiers'))

const Dashboard = lazy(() => import('pages/Dashboard'))
const Login = lazy(() => import('pages/Login'))
const Summary = lazy(() => import('pages/Summary'))
const History = lazy(() => import('pages/History'))
const Financial = lazy(() => import('pages/Financial'))
const Payments = lazy(() => import('pages/Payments'))
const Bonuses = lazy(() => import('pages/Bonuses'))

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
      {
        path: NAVIGATION.agents.link,
        element: (
          <ProtectedRoute allowedRoles={['0', '1']}>
            {withSuspense(Agents)}
          </ProtectedRoute>
        ),
      },
      {
        path: `${NAVIGATION.shops.link}/:agent?`,
        element: (
          <ProtectedRoute allowedRoles={['0', '1']}>
            {withSuspense(Shops)}
          </ProtectedRoute>
        ),
      },
      {
        path: `${NAVIGATION.players.link}/:agent?/:shop?`,
        element: (
          <ProtectedRoute allowedRoles={['0', '1', '2']}>
            {withSuspense(Players)}
          </ProtectedRoute>
        ),
      },
      {
        path: `${NAVIGATION.cashiers.link}/:agent?/:shop?`,
        element: (
          <ProtectedRoute allowedRoles={['0', '1', '2']}>
            {withSuspense(Cashiers)}
          </ProtectedRoute>
        ),
      },
      {
        path: NAVIGATION.summary.link,
        element: withSuspense(Summary),
      },
      {
        path: NAVIGATION.history.link,
        element: withSuspense(History),
      },
      {
        path: NAVIGATION.financial.link,
        element: withSuspense(Financial),
      },
      {
        path: NAVIGATION.payments.link,
        element: withSuspense(Payments),
      },
      {
        path: NAVIGATION.bonuses.link,
        element: withSuspense(Bonuses),
      },
      {
        path: NAVIGATION.login.link,
        element: withSuspense(Login),
      },
    ],
  },
])
