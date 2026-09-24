import { Navigate, Outlet } from 'react-router-dom'

import { NAVIGATION } from 'constant/config'

import { useAuthStore } from 'stores/authStore'

const ProtectedRoute = ({ allowedRoles }) => {
  const { auth, isAuth } = useAuthStore()

  if (!isAuth()) {
    return <Navigate to={NAVIGATION.login.link} replace />
  }

  if (allowedRoles && !allowedRoles.includes(auth?.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
