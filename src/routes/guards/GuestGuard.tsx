import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface GuestGuardProps {
  redirectTo?: string
}

export function GuestGuard({ redirectTo }: GuestGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (isAuthenticated && user) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />
    }

    const userRole = (user.role || '').toLowerCase()
    let target = '/admin/dashboard'
    if (userRole === 'accountant') {
      target = '/accountant/dashboard'
    } else if (userRole === 'engineer') {
      target = '/engineer/dashboard'
    } else if (userRole === 'reader') {
      target = '/reader/dashboard'
    }

    return <Navigate to={target} replace />
  }

  return <Outlet />
}
