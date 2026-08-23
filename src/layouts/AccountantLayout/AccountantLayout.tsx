// ============================================================
// AccountantLayout — Main shell layout for the Accountant module
// Composes: AccountantSidebar + AdminHeader + Content area
// ============================================================

import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AccountantSidebar } from './AccountantSidebar'
import { AdminHeader } from '../AdminLayout/AdminHeader'

/** Maps route paths to page titles */
const PAGE_TITLE_MAP: Record<string, string> = {
 '/accountant/dashboard': 'لوحة تحكم المحاسب',
 '/accountant/invoices': 'الفواتير',
 '/accountant/readings': 'إدارة القراءات',
 '/accountant/service-requests': 'طلبات الخدمة',
 '/accountant/equipment': 'المعدات',
}

export function AccountantLayout() {
 const location = useLocation()
 const [isMobileOpen, setIsMobileOpen] = useState(false)

 // Resolve page title from current route
 const pageTitle = PAGE_TITLE_MAP[location.pathname]
 
 // Optional: Provide subtitle for specific pages (like dashboard)
 const pageSubtitle = location.pathname === '/accountant/dashboard' 
 ? 'متابعة الفواتير والتحصيلات والمهام المحاسبية.' 
 : undefined

 return (
 <div className="admin-shell">
 {/* Sidebar */}
 <AccountantSidebar
 isMobileOpen={isMobileOpen}
 onMobileClose={() => setIsMobileOpen(false)}
 />

 {/* Main content area */}
 <div className="admin-main">
 {/* Header */}
 <AdminHeader
 title={pageTitle}
 subtitle={pageSubtitle}
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
