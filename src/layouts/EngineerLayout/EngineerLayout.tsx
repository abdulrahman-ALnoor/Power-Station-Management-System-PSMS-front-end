// ============================================================
// EngineerLayout — Main shell layout for the Engineer module
// Composes: EngineerSidebar + AdminHeader + Content area
// ============================================================

import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { EngineerSidebar } from './EngineerSidebar'
import { AdminHeader } from '../AdminLayout/AdminHeader'
import { useLanguage } from '@/hooks/useLanguage'

/** Maps route paths to page titles (i18n keys) */
const PAGE_TITLE_MAP: Record<string, string> = {
 '/engineer/dashboard': 'navigation:engineerDashboard',
 '/engineer/service-requests': 'navigation:serviceRequests',
 '/engineer/equipment': 'navigation:equipment',
 '/engineer/reports': 'navigation:reports',
 '/engineer/activity-log': 'navigation:activityLog',
}

export function EngineerLayout() {
 const { t } = useLanguage()
 const location = useLocation()
 const [isMobileOpen, setIsMobileOpen] = useState(false)

 // Resolve page title from current route
 const titleKey = PAGE_TITLE_MAP[location.pathname]
 const pageTitle = titleKey
 ? t(titleKey.replace('navigation:', ''), { ns: 'navigation' })
 : undefined

 return (
 <div className="admin-shell">
 {/* Sidebar */}
 <EngineerSidebar
 isMobileOpen={isMobileOpen}
 onMobileClose={() => setIsMobileOpen(false)}
 />

 {/* Main content area */}
 <div className="admin-main">
 {/* Header */}
 <AdminHeader
 title={pageTitle}
 onMobileMenuToggle={() => setIsMobileOpen(true)}
 />

 {/* Page content — rendered by child routes */}
 <main className="admin-content" id="main-content" tabIndex={-1}>
 <Outlet />
 </main>
 </div>
 </div>
 )
}
