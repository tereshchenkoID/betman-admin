import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import App from '../App'
import Loader from 'components/Loader'

const Dashboard = lazy(() => import('pages/Dashboard'))
const Login = lazy(() => import('pages/Login'))
const Settings = lazy(() => import('pages/Settings'))
const Accounts = lazy(() => import('pages/Accounts'))
const Tickets = lazy(() => import('pages/Tickets'))
const DailySums = lazy(() => import('pages/DailySums'))
const GeneralOverview = lazy(() => import('pages/GeneralOverview'))
const TransferSearch = lazy(() => import('pages/TransferSearch'))
const Settlement = lazy(() => import('pages/Settlement'))

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
      { path: 'login', element: withSuspense(Login) },
      { path: 'accounts', element: withSuspense(Accounts) },
      { path: 'transfer-search', element: withSuspense(TransferSearch) },
      { path: 'settings', element: withSuspense(Settings) },
      { path: 'tickets', element: withSuspense(Tickets) },
      { path: 'settlement', element: withSuspense(Settlement) },
      { path: 'daily-sums', element: withSuspense(DailySums) },
      { path: 'general-overview', element: withSuspense(GeneralOverview) },
    ],
  },
])
