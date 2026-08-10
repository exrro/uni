/** Guard for protected routes: requires a valid token and matching role. */

import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({
  role,
  children,
}: {
  role: string
  children: ReactNode
}) {
  const { isAuthenticated, role: currentRole } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname, toast: 'لطفاً ابتدا وارد شوید' }} replace />
  }
  if (currentRole !== role) {
    return <Navigate to="/login" state={{ from: location.pathname, toast: 'دسترسی مجاز نیست' }} replace />
  }
  return <>{children}</>
}
