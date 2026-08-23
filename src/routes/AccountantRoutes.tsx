// ============================================================
// AccountantRoutes – Sub-router for the Accountant module
// ============================================================

import { Route, Routes, Navigate } from 'react-router-dom'
import { AccountantLayout } from '@/layouts/AccountantLayout/AccountantLayout'
import { AccountantDashboardPage } from '@/pages/accountant/dashboard/AccountantDashboardPage'
import { AccountantInvoicesPage } from '@/pages/accountant/invoices/AccountantInvoicesPage'
import { AccountantEquipmentPage } from '@/pages/accountant/equipment/AccountantEquipmentPage'
import { AccountantServiceRequestsPage } from '@/pages/accountant/service-requests/AccountantServiceRequestsPage'
import { AccountantReadingsPage } from '@/pages/accountant/readings/AccountantReadingsPage'
import { AuthGuard } from './guards/AuthGuard'

export function AccountantRoutes() {
  return (
    <Routes>
      <Route element={<AuthGuard />}>
        <Route element={<AccountantLayout />}>
          <Route path="dashboard" element={<AccountantDashboardPage />} />
          <Route path="invoices" element={<AccountantInvoicesPage />} />
          <Route path="readings" element={<AccountantReadingsPage />} />
          <Route path="service-requests" element={<AccountantServiceRequestsPage />} />
          <Route path="equipment" element={<AccountantEquipmentPage />} />

          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  )
}