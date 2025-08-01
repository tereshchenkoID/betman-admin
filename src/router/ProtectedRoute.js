import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { auth } = useSelector(state => state.auth)

  if (!allowedRoles.includes(auth?.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
