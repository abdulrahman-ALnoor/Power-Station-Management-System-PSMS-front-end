import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminRoutes } from './AdminRoutes'
import { EngineerRoutes } from './EngineerRoutes'
import { ReaderRoutes } from './ReaderRoutes'
import { AccountantRoutes } from './AccountantRoutes'
import { GuestGuard } from './guards/GuestGuard'

const Login = lazy(() => import('@/pages/auth/Login'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  )
}

export function AppRouter() {
  return (
    <Routes>
      {/* Public Login Route (Unified for all roles) */}
      <Route element={<GuestGuard />}>
        <Route
          path="/login"
          element={
            <Suspense fallback={<PageLoader />}>
              <Login />
            </Suspense>
          }
        />
      </Route>

      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Admin module */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* Engineer module */}
      <Route path="/engineer/*" element={<EngineerRoutes />} />

      {/* Reader module */}
      <Route path="/reader/*" element={<ReaderRoutes />} />

      {/* Accountant module */}
      <Route path="/accountant/*" element={<AccountantRoutes />} />

      {/* 404 fallback */}
      <Route
        path="*"
        element={
          <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <h1 className="text-display" style={{ color: 'var(--color-primary)' }}>
              404
            </h1>
            <p className="text-body" style={{ color: 'var(--color-text-muted)' }}>
              Page not found
            </p>
          </div>
        }
      />
    </Routes>
  )
}
