// ============================================================
// Root router — main application routes
// ============================================================

import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminRoutes } from './AdminRoutes'

/**
 * Root-level route configuration.
 * - / → redirects to /admin
 * - /admin/* → AdminRoutes (protected, with layout)
 */
export function AppRouter() {
  return (
    <Routes>
      {/* Root redirect to admin */}
      <Route path="/" element={<Navigate to="/admin" replace />} />

      {/* Admin module — all sub-routes handled by AdminRoutes */}
      <Route path="/admin/*" element={<AdminRoutes />} />

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
