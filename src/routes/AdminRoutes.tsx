// ============================================================
// Admin Routes — Route definitions for the Admin module
// ============================================================

import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AdminLayout } from '@/layouts/AdminLayout'
import { AuthGuard } from './guards/AuthGuard'
import { GuestGuard } from './guards/GuestGuard'
import { EquipmentManagementPage } from '@/pages/admin/equipment/EquipmentManagementPage'
import { InvoicesManagementPage } from '@/pages/admin/invoices/InvoicesManagementPage'
import { CompanyProfilePage } from '@/pages/admin/company-profile/CompanyProfilePage'
import { MeterReadingsManagementPage } from '@/pages/admin/readings/MeterReadingsManagementPage'
import { DebugBoundary } from '@/DebugBoundary'

// Lazy-loaded pages (will be implemented in later steps)
const AdminPlaceholder = lazy(
  () => import('@/pages/admin/AdminPlaceholder'),
)

const DashboardPage = lazy(() => import('@/pages/admin/Dashboard/DashboardPage'))
const EmployeesPage = lazy(() => import('@/pages/admin/employees/EmployeesPage'))
const MetersPage = lazy(() => import('@/pages/admin/meters/MetersPage'))
const Login = lazy(() => import('@/pages/auth/Login'))

/** Loading fallback used during lazy load */
function PageLoader() {
  return (
    <div className="flex items-center justify-center flex-1 min-h-64">
      <div
        className="w-8 h-8 border-4 rounded-full animate-spin"
        style={{
          borderColor: 'var(--color-border)',
          borderTopColor: 'var(--color-primary)',
        }}
        aria-label="Loading page"
      />
    </div>
  )
}

/** Admin module route group — all routes are behind AuthGuard */
export function AdminRoutes() {
  return (
    <Routes>
      {/* Public auth route */}
      <Route element={<GuestGuard />}>
        <Route
          path="login"
          element={
            <Suspense fallback={<PageLoader />}>
              <Login />
            </Suspense>
          }
        />
      </Route>

      {/* Protected admin routes */}
      <Route element={<AuthGuard />}>
        <Route element={<AdminLayout />}>
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<PageLoader />}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path="employees"
            element={
              <Suspense fallback={<PageLoader />}>
                <EmployeesPage />
              </Suspense>
            }
          />
          <Route
            path="customers"
            element={
              <Suspense fallback={<PageLoader />}>
                <AdminPlaceholder page="customers" />
              </Suspense>
            }
          />
          <Route
            path="equipment"
            element={
              <Suspense fallback={<PageLoader />}>
                <EquipmentManagementPage />
              </Suspense>
            }
          />
          <Route
            path="meters"
            element={
              <Suspense fallback={<PageLoader />}>
                <MetersPage />
              </Suspense>
            }
          />
          <Route
            path="stations"
            element={
              <Suspense fallback={<PageLoader />}>
                <AdminPlaceholder page="stations" />
              </Suspense>
            }
          />
          <Route
            path="readings"
            element={
              <Suspense fallback={<PageLoader />}>
                <MeterReadingsManagementPage />
              </Suspense>
            }
          />
          <Route
            path="requests"
            element={
              <Suspense fallback={<PageLoader />}>
                <AdminPlaceholder page="requests" />
              </Suspense>
            }
          />
          <Route
            path="invoices"
            element={
              <Suspense fallback={<PageLoader />}>
                <DebugBoundary>
                  <InvoicesManagementPage />
                </DebugBoundary>
              </Suspense>
            }
          />

          <Route
            path="settings"
            element={
              <Suspense fallback={<PageLoader />}>
                <CompanyProfilePage />
              </Suspense>
            }
          />
          {/* Default redirect to dashboard */}
          <Route index element={<DashboardPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
