import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from 'stores/authStore'
import { NAVIGATION } from 'constant/config'

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
