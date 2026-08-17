// ============================================================
// GuestGuard — Prevents authenticated users from accessing auth pages
// ============================================================

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface GuestGuardProps {
  redirectTo?: string
}

export function GuestGuard({ redirectTo = '/admin/dashboard' }: GuestGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  // If the user is already authenticated, don't let them see the login page
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}
