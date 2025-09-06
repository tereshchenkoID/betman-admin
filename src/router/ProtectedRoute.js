import React from 'react'
import { Navigate } from 'react-router-dom'

import { useAuth } from 'hooks/useAuth'

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { auth } = useAuth()

  if (!allowedRoles.includes(auth?.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
