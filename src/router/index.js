import React, { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { NAVIGATION } from 'constant/config'

import App from 'App'
import Loader from 'components/Loader'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'

const UsersAgents = lazy(() => import('pages/Users/Agents'))
const UsersShops = lazy(() => import('pages/Users/Shops'))
const UsersPlayers = lazy(() => import('pages/Users/Players'))
const UsersCashiers = lazy(() => import('pages/Users/Cashiers'))

const Dashboard = lazy(() => import('pages/Dashboard'))
const Login = lazy(() => import('pages/Login'))

const ReportsFinancial = lazy(() => import('pages/Reports/Financial'))
const ReportsGames = lazy(() => import('pages/Reports/Games'))
// const ReportsSummary = lazy(() => import('pages/Reports/Summary'))
// const ReportsHistory = lazy(() => import('pages/Reports/History'))
// const ReportsPayments = lazy(() => import('pages/Reports/Payments'))
// const ReportsBonuses = lazy(() => import('pages/Reports/Bonuses'))

const ManagementsPromos = lazy(() => import('pages/Managements/Promos'))
const ManagementsBanners = lazy(() => import('pages/Managements/Banners'))
const ManagementsJackpots = lazy(() => import('pages/Managements/Jackpots'))
const ManagementsBonuses = lazy(() => import('pages/Managements/Bonuses'))

const NotFound = lazy(() => import('pages/NotFound'))

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
        path: `${NAVIGATION.agents.link}/:agent?`,
        element: (
          <ProtectedRoute allowedRoles={['-1', '0', '1']}>
            {withSuspense(UsersAgents)}
          </ProtectedRoute>
        ),
      },
      {
        path: `${NAVIGATION.shops.link}/:agent?`,
        element: (
          <ProtectedRoute allowedRoles={['-1', '0', '1']}>
            {withSuspense(UsersShops)}
          </ProtectedRoute>
        ),
      },
      {
        path: `${NAVIGATION.players.link}/:agent?/:shop?`,
        element: (
          <ProtectedRoute allowedRoles={['-1', '0', '1', '2']}>
            {withSuspense(UsersPlayers)}
          </ProtectedRoute>
        ),
      },
      {
        path: `${NAVIGATION.cashiers.link}/:agent?/:shop?`,
        element: (
          <ProtectedRoute allowedRoles={['-1', '0', '1', '2']}>
            {withSuspense(UsersCashiers)}
          </ProtectedRoute>
        ),
      },
      {
        path: NAVIGATION.reports.financial.link,
        element: withSuspense(ReportsFinancial),
      },
      {
        path: NAVIGATION.reports.games.link,
        element: withSuspense(ReportsGames),
      },

      // {
      //   path: NAVIGATION.reports.summary.link,
      //   element: withSuspense(ReportsSummary),
      // },
      // {
      //   path: NAVIGATION.reports.history.link,
      //   element: withSuspense(ReportsHistory),
      // },
      // {
      //   path: NAVIGATION.reports.payments.link,
      //   element: withSuspense(ReportsPayments),
      // },
      // {
      //   path: NAVIGATION.reports.bonuses.link,
      //   element: withSuspense(ReportsBonuses),
      // },
      {
        path: NAVIGATION.login.link,
        element: (
          <PublicRoute>
            {withSuspense(Login)}
          </PublicRoute>
        )
      },
      {
        path: `${NAVIGATION.managements.promos.link}/:promo?`,
        element: (
          <ProtectedRoute allowedRoles={['-1']}>
            {withSuspense(ManagementsPromos)}
          </ProtectedRoute>
        )
      },
      {
        path: `${NAVIGATION.managements.banners.link}/:banner?`,
        element: (
          <ProtectedRoute allowedRoles={['-1']}>
            {withSuspense(ManagementsBanners)}
          </ProtectedRoute>
        )
      },
      {
        path: `${NAVIGATION.managements.jackpots.link}/:jackpot?`,
        element: (
          <ProtectedRoute allowedRoles={['-1']}>
            {withSuspense(ManagementsJackpots)}
          </ProtectedRoute>
        )
      },
      {
        path: `${NAVIGATION.managements.bonuses.link}/:bonus?`,
        element: (
          <ProtectedRoute allowedRoles={['-1']}>
            {withSuspense(ManagementsBonuses)}
          </ProtectedRoute>
        )
      },
      {
        path: '*',
        element: withSuspense(NotFound),
      },
    ],
  },
])
