// ============================================================
// ReaderRoutes — Sub-router for the Reader module
// ============================================================

import { Route, Routes, Navigate } from 'react-router-dom'
import { ReaderLayout } from '@/layouts/ReaderLayout/ReaderLayout'
import { ReaderDashboardPage } from '@/pages/reader/dashboard/ReaderDashboardPage'
import { ReaderEquipmentPage } from '@/pages/reader/equipment/ReaderEquipmentPage'
import { ReaderReadingsPage } from '@/pages/reader/readings/ReaderReadingsPage'
import { ReaderServiceRequestsPage } from '@/pages/reader/service-requests/ReaderServiceRequestsPage'
import { AuthGuard } from './guards/AuthGuard'

export function ReaderRoutes() {
  return (
    <Routes>
      <Route element={<AuthGuard />}>
        <Route element={<ReaderLayout />}>
          <Route path="dashboard" element={<ReaderDashboardPage />} />
          
          <Route path="equipment" element={<ReaderEquipmentPage />} />
          <Route path="readings" element={<ReaderReadingsPage />} />
          <Route path="service-requests" element={<ReaderServiceRequestsPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  )
}
