// ============================================================
// AuthGuard — Route protection placeholder
// Will perform real token validation in Step 2
// ============================================================

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface AuthGuardProps {
  redirectTo?: string
}

/**
 * Protects routes that require authentication.
 * Currently checks for a token in localStorage.
 * Will perform server-side session validation in Step 2.
 */
export function AuthGuard({ redirectTo = '/admin/login' }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}
