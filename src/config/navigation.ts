// ============================================================
// Navigation config — typed, data-driven
// Maps nav structure; used by AdminSidebar
// ============================================================

import type { NavGroup } from '@/types/common'

/**
 * Admin navigation groups.
 * labelKey references i18n keys under 'navigation' namespace.
 * icon references Lucide icon component names.
 * permission references future RBAC keys.
 */
export const ADMIN_NAV_GROUPS: NavGroup[] = [
 {
 key: 'main',
 labelKey: 'navigation:groups.main',
 items: [
 {
 key: 'dashboard',
 labelKey: 'navigation:dashboard',
 icon: 'LayoutDashboard',
 path: '/admin/dashboard',
 },
 {
 key: 'employees',
 labelKey: 'navigation:employees',
 icon: 'Users',
 path: '/admin/employees',
 permission: 'employees.view',
 },
 {
 key: 'customers',
 labelKey: 'navigation:customers',
 icon: 'UserCheck',
 path: '/admin/customers',
 permission: 'customers.view',
 },
 {
 key: 'meters',
 labelKey: 'navigation:meters',
 icon: 'Gauge',
 path: '/admin/meters',
 permission: 'meters.view',
 },
 {
 key: 'financial',
 labelKey: 'navigation:financial',
 icon: 'Receipt',
 path: '/admin/invoices',
 permission: 'financial.view',
 },
 {
 key: 'equipment',
 labelKey: 'navigation:equipment',
 icon: 'Factory',
 path: '/admin/equipment',
 permission: 'equipment.view',
 },
 {
 key: 'readings',
 labelKey: 'navigation:readings',
 icon: 'Activity',
 path: '/admin/readings',
 permission: 'readings.view',
 },
 {
 key: 'settings',
 labelKey: 'navigation:companySettings',
 icon: 'Settings',
 path: '/admin/settings',
 permission: 'settings.view',
 },
 {
 key: 'reports',
 labelKey: 'navigation:reports',
 icon: 'FileText',
 path: '/admin/reports',
 permission: 'reports.view',
 },
 ],
 },
]

export const ENGINEER_NAV_GROUPS: NavGroup[] = [
 {
 key: 'main',
 labelKey: 'navigation:groups.main',
 items: [
 {
 key: 'dashboard',
 labelKey: 'navigation:engineerDashboard',
 icon: 'LayoutDashboard',
 path: '/engineer/dashboard',
 },
 {
 key: 'serviceRequests',
 labelKey: 'navigation:serviceRequests',
 icon: 'Headset',
 path: '/engineer/service-requests',
 },
 {
 key: 'equipment',
 labelKey: 'navigation:equipment',
 icon: 'Factory',
 path: '/engineer/equipment',
 },
 ],
 },
]

export const READER_NAV_GROUPS: NavGroup[] = [
 {
 key: 'main',
 labelKey: 'navigation:groups.main',
 items: [
 {
 key: 'dashboard',
 labelKey: 'navigation:dashboard',
 icon: 'LayoutDashboard',
 path: '/reader/dashboard',
 },
 {
 key: 'equipment',
 labelKey: 'navigation:equipment',
 icon: 'Factory',
 path: '/reader/equipment',
 },
 {
 key: 'readings',
 labelKey: 'navigation:readings',
 icon: 'Activity',
 path: '/reader/readings',
 },
 {
 key: 'serviceRequests',
 labelKey: 'navigation:serviceRequests',
 icon: 'Headset',
 path: '/reader/service-requests',
 },
 {
 key: 'profile',
 labelKey: 'navigation:profile',
 icon: 'User',
 path: '/reader/profile',
 },
 ],
 },
]

export const ACCOUNTANT_NAV_GROUPS: NavGroup[] = [
 {
 key: 'main',
 labelKey: 'navigation:groups.main',
 items: [
 {
 key: 'dashboard',
 labelKey: 'navigation:dashboard',
 icon: 'LayoutDashboard',
 path: '/accountant/dashboard',
 },
 {
 key: 'invoices',
 labelKey: 'navigation:invoices',
 icon: 'Receipt',
 path: '/accountant/invoices',
 },
 {
 key: 'readings',
 labelKey: 'navigation:readings',
 icon: 'Activity',
 path: '/accountant/readings',
 },
 {
 key: 'serviceRequests',
 labelKey: 'navigation:serviceRequests',
 icon: 'Headset',
 path: '/accountant/service-requests',
 },
 {
 key: 'equipment',
 labelKey: 'navigation:equipment',
 icon: 'Factory',
 path: '/accountant/equipment',
 },
 ],
 },
]
