import { Navigate } from 'react-router-dom'

import { useAuthStore } from 'src/stores/authStore'

const PublicRoute = ({ children }) => {
  const { auth } = useAuthStore()

  if (auth?.role) {
    return <Navigate to="/" replace />
  }

  return children
}

export default PublicRoute
