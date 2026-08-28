import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from 'stores/authStore'

const PublicRoute = () => {
  const { isAuth } = useAuthStore()

  if (isAuth()) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default PublicRoute
