import { Navigate } from 'react-router-dom'

import { useAuthStore } from 'src/stores/authStore'

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { auth } = useAuthStore()

  if (!allowedRoles.includes(auth?.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
