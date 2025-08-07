import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PublicRoute = ({ children }) => {
  const { auth } = useSelector(state => state.auth)

  if (auth?.role) {
    return <Navigate to="/" replace />
  }

  return children
}

export default PublicRoute
