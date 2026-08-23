// ============================================================
// Admin Routes — Route definitions for the Admin module
// ============================================================

import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { OverdueInvoicesPage } from '@/pages/admin/reports/OverdueInvoicesPage'
import { AdminLayout } from '@/layouts/AdminLayout'
import { CollectionsReportPage } from '@/pages/admin/reports/CollectionsReportPage'
import { AuthGuard } from './guards/AuthGuard'
import { GuestGuard } from './guards/GuestGuard'
import { AccountStatementPage } from '@/pages/admin/reports/AccountStatementPage'
import { EquipmentManagementPage } from '@/pages/admin/equipment/EquipmentManagementPage'

import { InvoicesManagementPage } from '@/pages/admin/invoices/InvoicesManagementPage'

import { CompanyProfilePage } from '@/pages/admin/company-profile/CompanyProfilePage'

import { MeterReadingsManagementPage } from '@/pages/admin/readings/MeterReadingsManagementPage'

import { RevenueReportPage } from '@/pages/admin/reports/RevenueReportPage'

import { DebugBoundary } from '@/DebugBoundary'


// ============================================================
// Lazy-loaded pages
// ============================================================

const AdminReportsPage = lazy(() => import('@/pages/admin/reports/AdminReportsPage'))
const AdminPlaceholder = lazy(
 () => import('@/pages/admin/AdminPlaceholder'),
)

const DashboardPage = lazy(
  () =>
    import(
      '@/pages/admin/Dashboard/DashboardPage'
    ),
)

const EmployeesPage = lazy(
  () =>
    import(
      '@/pages/admin/employees/EmployeesPage'
    ),
)

const MetersPage = lazy(
  () =>
    import(
      '@/pages/admin/meters/MetersPage'
    ),
)

const CustomersPage = lazy(
  () => import('@/pages/admin/customers/CustomersPage'),
)

const Login = lazy(
  () =>
    import(
      '@/pages/auth/Login'
    ),
)


// ============================================================
// Loading fallback
// ============================================================

function PageLoader() {
  return (
    <div className="flex items-center justify-center flex-1 min-h-64">

      <div
        className="w-8 h-8 border-4 rounded-full animate-spin"
        style={{
          borderColor: 'var(--color-border)',
          borderTopColor:
            'var(--color-primary)',
        }}
        aria-label="Loading page"
      />

    </div>
  )
}


// ============================================================
// Admin Routes
// ============================================================

export function AdminRoutes() {
  return (
    <Routes>

      {/* =====================================================
          Public Authentication Routes
      ===================================================== */}

      <Route element={<GuestGuard />}>

        <Route
          path="login"
          element={
            <Suspense
              fallback={<PageLoader />}
            >
              <Login />
            </Suspense>
          }
        />

      </Route>


      {/* =====================================================
          Protected Admin Routes
      ===================================================== */}

      <Route element={<AuthGuard />}>

        <Route element={<AdminLayout />}>

          {/* =========================
              Dashboard
          ========================= */}


          <Route
            path="dashboard"
            element={
              <Suspense
                fallback={<PageLoader />}
              >
                <DashboardPage />
              </Suspense>
            }
          />


          {/* =========================
              Employees
          ========================= */}

          <Route
            path="employees"
            element={
              <Suspense
                fallback={<PageLoader />}
              >
                <EmployeesPage />
              </Suspense>
            }
          />


          {/* =========================
              Customers
          ========================= */}

          <Route
            path="customers"
            element={
              <Suspense
                fallback={<PageLoader />}
              >
                <CustomersPage />
              </Suspense>
            }
          />


          {/* =========================
              Equipment
          ========================= */}

          <Route
            path="equipment"
            element={
              <Suspense
                fallback={<PageLoader />}
              >
                <EquipmentManagementPage />
              </Suspense>
            }
          />


          {/* =========================
              Meters
          ========================= */}

          <Route
            path="meters"
            element={
              <Suspense
                fallback={<PageLoader />}
              >
                <MetersPage />
              </Suspense>
            }
          />


          {/* =========================
              Stations
          ========================= */}

          <Route
            path="stations"
            element={
              <Suspense
                fallback={<PageLoader />}
              >
                <AdminPlaceholder
                  page="stations"
                />
              </Suspense>
            }
          />


          {/* =========================
              Meter Readings
          ========================= */}

          <Route
            path="readings"
            element={
              <Suspense
                fallback={<PageLoader />}
              >
                <MeterReadingsManagementPage />
              </Suspense>
            }
          />


          {/* =========================
              Service Requests
          ========================= */}

          <Route
            path="requests"
            element={
              <Suspense
                fallback={<PageLoader />}
              >
                <AdminPlaceholder
                  page="requests"
                />
              </Suspense>
            }
          />


          {/* =========================
              Invoices
          ========================= */}

          <Route
            path="invoices"
            element={
              <Suspense
                fallback={<PageLoader />}
              >
                <DebugBoundary>

                  <InvoicesManagementPage />

                </DebugBoundary>
              </Suspense>
            }
          />

<Route
  path="reports"
  element={
    <Suspense fallback={<PageLoader />}>
      <AdminReportsPage />
    </Suspense>
  }
/>
<Route
  path="reports/overdue-invoices"
  element={
    <OverdueInvoicesPage />
  }
/>

          {/* =========================
              Revenue Report
          ========================= */}

          <Route
            path="reports/revenue"
            element={
              <Suspense
                fallback={<PageLoader />}
              >
                <RevenueReportPage />
              </Suspense>
            }
          />
          <Route
  path="reports/collections"
  element={
    <Suspense fallback={<PageLoader />}>
      <CollectionsReportPage />
    </Suspense>
  }
/>
<Route
  path="reports/account-statement"
  element={
    <Suspense fallback={<PageLoader />}>
      <AccountStatementPage />
    </Suspense>
  }
/>


          {/* =========================
              Settings
          ========================= */}

          <Route
            path="settings"
            element={
              <Suspense
                fallback={<PageLoader />}
              >
                <CompanyProfilePage />
              </Suspense>
            }
          />


          {/* =========================
              Default Route
          ========================= */}

          <Route
            index
            element={
              <DashboardPage />
            }
          />

        </Route>

      </Route>

    </Routes>
  )
}
