import React from 'react'
import { Navigate } from 'react-router-dom'

import { useAuth } from 'hooks/useAuth'

const PublicRoute = ({ children }) => {
  const { auth } = useAuth()

  if (auth?.role) {
    return <Navigate to="/" replace />
  }

  return children
}

export default PublicRoute
