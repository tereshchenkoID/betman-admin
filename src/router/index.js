import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { NAVIGATION } from "../constant/config"

import App from 'App'
import Loader from 'components/Loader'

const Agents = lazy(() => import('pages/Agents'))
const Shops = lazy(() => import('pages/Shops'))
const Players = lazy(() => import('pages/Players'))
const Cashiers = lazy(() => import('pages/Cashiers'))

const Dashboard = lazy(() => import('pages/Dashboard'))
const Login = lazy(() => import('pages/Login'))
const Settings = lazy(() => import('pages/Settings'))
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
      { path: NAVIGATION.agents.link, element: withSuspense(Agents) },
      { path: `${NAVIGATION.shops.link}/:agent?`, element: withSuspense(Shops) },
      { path: `${NAVIGATION.players.link}/:agent?/:shop?`, element: withSuspense(Players) },
      { path: `${NAVIGATION.cashiers.link}/:agent?/:shop?`, element: withSuspense(Cashiers) },
      { path: NAVIGATION.login.link, element: withSuspense(Login) },
      { path: NAVIGATION.reports.link, element: withSuspense(Reports) },
      { path: NAVIGATION.history.link, element: withSuspense(History) },
      { path: NAVIGATION.financial.link, element: withSuspense(Financial) },
      { path: NAVIGATION.settings.link, element: withSuspense(Settings) },
    ],
  },
])
