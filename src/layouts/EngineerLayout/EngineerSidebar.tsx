// ============================================================
// EngineerSidebar — Dark navy sidebar navigation for Engineer
// Design: 280px | Navy #0f2d5c | Cairo font | RTL-aware
// Based on Stitch Integrated Design System (Al-Barq Identity)
// ============================================================

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Zap, X } from 'lucide-react'
import { cn } from '@/utils/cn'
import { NavigationItem } from '@/components/navigation'
import { ENGINEER_NAV_GROUPS } from '@/config/navigation'
import { useLanguage } from '@/hooks/useLanguage'
import { useAuth } from '@/hooks/useAuth'
import { STORAGE_KEYS } from '@/config/constants'

interface EngineerSidebarProps {
  isMobileOpen: boolean
  onMobileClose: () => void
}

export function EngineerSidebar({ isMobileOpen, onMobileClose }: EngineerSidebarProps) {
  const { isRTL, t } = useLanguage()
  const { user, logout } = useAuth()

  // Persist sidebar collapsed state
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED) === 'true'
  })

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, String(next))
      return next
    })
  }

  // Collapse chevron direction — accounts for both RTL and collapsed state
  const CollapseIcon =
    (isRTL && !collapsed) || (!isRTL && collapsed)
      ? ChevronLeft
      : ChevronRight

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          'sidebar-overlay',
          isMobileOpen && 'visible',
        )}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      {/* Sidebar panel */}
      <aside
        className={cn(
          'admin-sidebar',
          collapsed && 'collapsed',
          isMobileOpen && 'mobile-open',
        )}
        aria-label={t('common:appName')}
      >
        {/* ── Logo area ────────────────────────────────────── */}
        <div
          className={cn(
            'flex items-center h-16 shrink-0 border-b px-4 gap-3',
            'border-white/10',
            collapsed ? 'justify-center' : isRTL ? 'flex-row-reverse' : 'flex-row',
          )}
        >
          {/* Brand icon */}
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'var(--color-accent)' }}
          >
            <Zap size={20} className="text-white" strokeWidth={2.5} />
          </div>

          {/* Brand name */}
          {!collapsed && (
            <div className={cn('min-w-0', isRTL ? 'text-right' : 'text-left')}>
              <p
                className="font-bold text-sm leading-tight truncate"
                style={{ color: 'var(--color-on-primary)' }}
              >
                {t('common:appName')}
              </p>
              <p
                className="text-xs leading-tight truncate mt-0.5"
                style={{ color: 'var(--color-sidebar-text-muted)' }}
              >
                {t('navigation:engineerDashboard')}
              </p>
            </div>
          )}

          {/* Mobile close button */}
          <button
            className="ms-auto lg:hidden p-1 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            onClick={onMobileClose}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Navigation groups ────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2">
          {ENGINEER_NAV_GROUPS.map((group, groupIndex) => (
            <div key={group.key} className={cn(groupIndex > 0 && 'mt-6')}>
              {/* Group label — only shown when not collapsed */}
              {!collapsed && (
                <p
                  className="text-label px-3 mb-1 uppercase tracking-widest"
                  style={{ color: 'var(--color-sidebar-text-muted)' }}
                >
                  {t(group.labelKey)}
                </p>
              )}

              {/* Navigation items */}
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <NavigationItem
                    key={item.key}
                    item={item}
                    collapsed={collapsed}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* ── User profile area ────────────────────────────── */}
        <div className="shrink-0 border-t border-white/10 p-3">
          <div
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg',
              'hover:bg-white/5 transition-colors cursor-pointer',
              collapsed ? 'justify-center' : isRTL ? 'flex-row-reverse' : 'flex-row',
            )}
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
              style={{
                background: 'var(--color-accent)',
                color: 'var(--color-on-accent)',
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() ?? 'E'}
            </div>

            {!collapsed && (
              <div className={cn('min-w-0 flex-1', isRTL ? 'text-right' : 'text-left')}>
                <p
                  className="text-sm font-medium leading-tight truncate"
                  style={{ color: 'var(--color-on-primary)' }}
                >
                  {user?.name ?? t('navigation:myProfile')}
                </p>
                <p
                  className="text-xs leading-tight truncate mt-0.5"
                  style={{ color: 'var(--color-sidebar-text-muted)' }}
                >
                  {user?.email ?? 'engineer@psms.com'}
                </p>
              </div>
            )}
          </div>

          {/* Logout button */}
          {!collapsed && (
            <button
              onClick={logout}
              className="w-full mt-2 px-3 py-2 rounded-lg text-sm font-medium text-left"
              style={{ color: 'var(--color-sidebar-text-muted)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = ''
                e.currentTarget.style.color = 'var(--color-sidebar-text-muted)'
              }}
            >
              {t('navigation:logout')}
            </button>
          )}
        </div>

        {/* ── Collapse toggle (desktop only) ───────────────── */}
        <button
          onClick={toggleCollapsed}
          className={cn(
            'hidden lg:flex items-center justify-center',
            'absolute bottom-24 -end-3 w-6 h-6 rounded-full',
            'border border-white/20 bg-[var(--color-sidebar-bg)]',
            'text-white/60 hover:text-white transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <CollapseIcon size={12} />
        </button>
      </aside>
    </>
  )
}
