import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { NAVIGATION } from 'src/constant/config'

import App from 'App'
import Loader from 'components/Loader'
import PublicRoute from './PublicRoute'

const UsersUsers = lazy(() => import('pages/Users/Users'))
const UsersPlayers = lazy(() => import('pages/Users/Players'))
const Dashboard = lazy(() => import('pages/Dashboard'))
const Login = lazy(() => import('pages/Login'))
const ReportsFinancial = lazy(() => import('pages/Reports/Financial'))
const ReportsGames = lazy(() => import('pages/Reports/Games'))
const ManagementsPromos = lazy(() => import('pages/Managements/Promos'))
const ManagementsQuests = lazy(() => import('pages/Managements/Quests'))
const ManagementsBanners = lazy(() => import('pages/Managements/Banners'))
const ManagementsChallenges = lazy(() => import('pages/Managements/Challenges'))
const ManagementsJackpots = lazy(() => import('pages/Managements/Jackpots'))
const ManagementsBonuses = lazy(() => import('pages/Managements/Bonuses'))
const ManagementsNotifications = lazy(() => import('pages/Managements/Notifications'))
const ManagementsPages = lazy(() => import('pages/Managements/Pages'))
const ManagementsModules = lazy(() => import('pages/Managements/Modules'))
const ManagementsWheels = lazy(() => import('pages/Managements/Wheels'))
const ManagementsTooltips = lazy(() => import('pages/Managements/Tooltips'))
const ManagementsSeo = lazy(() => import('pages/Managements/Seo'))

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
      {
        index: true,
        element: withSuspense(Dashboard)
      },
      {
        path: NAVIGATION.users.link,
        element: withSuspense(UsersUsers),
      },
      {
        path: NAVIGATION.players.link,
        element: withSuspense(UsersPlayers),
      },
      {
        path: NAVIGATION.reports.financial.link,
        element: withSuspense(ReportsFinancial),
      },
      {
        path: NAVIGATION.reports.games.link,
        element: withSuspense(ReportsGames),
      },
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
        element: withSuspense(ManagementsPromos),
      },
      {
        path: `${NAVIGATION.managements.quests.link}/:quest?`,
        element: withSuspense(ManagementsQuests),
      },
      {
        path: `${NAVIGATION.managements.banners.link}/:banner?`,
        element: withSuspense(ManagementsBanners),
      },
      {
        path: `${NAVIGATION.managements.challenges.link}/:challenge?`,
        element: withSuspense(ManagementsChallenges),
      },
      {
        path: `${NAVIGATION.managements.jackpots.link}/:jackpot?`,
        element: withSuspense(ManagementsJackpots),
      },
      {
        path: `${NAVIGATION.managements.bonuses.link}/:bonus?`,
        element: withSuspense(ManagementsBonuses),
      },
      {
        path: `${NAVIGATION.managements.notifications.link}/:notification?`,
        element: withSuspense(ManagementsNotifications),
      },
      {
        path: `${NAVIGATION.managements.modules.link}`,
        element: withSuspense(ManagementsModules),
      },
      {
        path: `${NAVIGATION.managements.pages.link}/:page?`,
        element: withSuspense(ManagementsPages),
      },
      {
        path: `${NAVIGATION.managements.wheels.link}/:wheel?`,
        element: withSuspense(ManagementsWheels),
      },
      {
        path: `${NAVIGATION.managements.tooltips.link}/:tooltip?`,
        element: withSuspense(ManagementsTooltips),
      },
      {
        path: `${NAVIGATION.managements.seo.link}/:seo?`,
        element: withSuspense(ManagementsSeo),
      },
      {
        path: '*',
        element: withSuspense(NotFound),
      },
    ],
  },
])
