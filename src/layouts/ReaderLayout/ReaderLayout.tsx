// ============================================================
// ReaderLayout — Main shell layout for the Reader module
// Composes: ReaderSidebar + AdminHeader + Content area
// ============================================================

import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ReaderSidebar } from './ReaderSidebar'
import { AdminHeader } from '../AdminLayout/AdminHeader'

/** Maps route paths to page titles */
const PAGE_TITLE_MAP: Record<string, string> = {
  '/reader/dashboard': 'لوحة تحكم القارئ',
  '/reader/service-requests': 'طلبات الخدمة',
  '/reader/equipment': 'المعدات',
  '/reader/readings': 'إدارة القراءات',
}

export function ReaderLayout() {
  const location = useLocation()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Resolve page title from current route
  const pageTitle = PAGE_TITLE_MAP[location.pathname]
  
  // Optional: Provide subtitle for specific pages (like dashboard)
  const pageSubtitle = location.pathname === '/reader/dashboard' 
    ? 'متابعة القراءات اليومية والعدادات والطلبات المرتبطة بمهامك.' 
    : undefined

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <ReaderSidebar
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
