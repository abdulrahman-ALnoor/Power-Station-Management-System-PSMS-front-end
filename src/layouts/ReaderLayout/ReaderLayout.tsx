// ============================================================
// ReaderLayout — Main shell layout for the Reader module
// Composes: ReaderSidebar + AdminHeader + Content area
// ============================================================

import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ReaderSidebar } from './ReaderSidebar'
import { AdminHeader } from '../AdminLayout/AdminHeader'

import { useLanguage } from '@/hooks/useLanguage'

export function ReaderLayout() {
 const location = useLocation()
 const [isMobileOpen, setIsMobileOpen] = useState(false)

 const { t } = useLanguage('reader')

 const getPageTitle = (pathname: string) => {
 switch (pathname) {
 case '/reader/dashboard': return t('header.title')
 case '/reader/service-requests': return t('pageTitles.serviceRequests')
 case '/reader/equipment': return t('pageTitles.equipment')
 case '/reader/readings': return t('pageTitles.readings')
 default: return ''
 }
 }

 const pageTitle = getPageTitle(location.pathname)
 const pageSubtitle = location.pathname === '/reader/dashboard'
 ? t('header.subtitle')
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
