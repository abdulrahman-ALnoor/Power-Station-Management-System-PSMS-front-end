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
    ],
  },
]
