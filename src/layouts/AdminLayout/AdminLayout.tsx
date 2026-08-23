// ============================================================
// AdminLayout — Main shell layout for the Admin module
// Composes: AdminSidebar + AdminHeader + Content area
// ============================================================

import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import { useLanguage } from '@/hooks/useLanguage'

/** Maps route paths to page titles (i18n keys) */
const PAGE_TITLE_MAP: Record<string, string> = {
 '/admin/dashboard': 'navigation:dashboard',
 '/admin/employees': 'navigation:employees',
 '/admin/customers': 'navigation:customers',
 '/admin/meters': 'navigation:meters',
 '/admin/stations': 'navigation:stations',
 '/admin/readings': 'navigation:readings',
 '/admin/requests': 'navigation:requests',
 '/admin/invoices': 'navigation:invoices',
 '/admin/settings': 'navigation:settings',
}

export function AdminLayout() {
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
 <AdminSidebar
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
