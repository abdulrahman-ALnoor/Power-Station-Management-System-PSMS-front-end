// ============================================================
// EngineerRoutes — Sub-router for the Engineer module
// ============================================================

import { Route, Routes, Navigate } from 'react-router-dom'
import { EngineerLayout } from '@/layouts/EngineerLayout/EngineerLayout'
import { EngineerDashboardPage } from '@/pages/engineer/dashboard/EngineerDashboardPage'
import { AuthGuard } from './guards/AuthGuard'

import { ServiceRequestsPage } from '@/pages/engineer/service-requests/ServiceRequestsPage'
import { EngineerEquipmentPage } from '@/pages/engineer/equipment/EngineerEquipmentPage'

export function EngineerRoutes() {
 return (
 <Routes>
 <Route element={<AuthGuard />}>
 <Route element={<EngineerLayout />}>
 <Route path="dashboard" element={<EngineerDashboardPage />} />
 <Route path="service-requests" element={<ServiceRequestsPage />} />
 <Route path="equipment" element={<EngineerEquipmentPage />} />
 
 {/* Placeholder routes for the rest of engineer navigation */}
 <Route path="reports/*" element={<div>Reports Placeholder</div>} />
 <Route path="activity-log/*" element={<div>Activity Log Placeholder</div>} />

 {/* Fallback */}
 <Route path="*" element={<Navigate to="dashboard" replace />} />
 </Route>
 </Route>
 </Routes>
 )
}
