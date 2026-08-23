
import { Route, Routes, Navigate } from 'react-router-dom'
import { EngineerLayout } from '@/layouts/EngineerLayout/EngineerLayout'
import { EngineerDashboardPage } from '@/pages/engineer/dashboard/EngineerDashboardPage'
import { EngineerEquipmentPage } from '@/pages/engineer/equipment/EngineerEquipmentPage'
import { ServiceRequestsPage } from '@/pages/engineer/service-requests/ServiceRequestsPage'
import { AuthGuard } from './guards/AuthGuard'

export function EngineerRoutes() {
  return (
    <Routes>
      <Route element={<AuthGuard />}>
        <Route element={<EngineerLayout />}>
          <Route path="dashboard" element={<EngineerDashboardPage />} />
          <Route path="service-requests" element={<ServiceRequestsPage />} />
          <Route path="equipment" element={<EngineerEquipmentPage />} />

          <Route path="reports/*" element={<div>Reports Placeholder</div>} />
          <Route path="activity-log/*" element={<div>Activity Log Placeholder</div>} />

          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  )
}
