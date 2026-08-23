// ============================================================
// ReaderSidebar — Dark navy sidebar navigation for Reader
// ============================================================

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Zap, X } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useLanguage } from '@/hooks/useLanguage'
import { useAuth } from '@/hooks/useAuth'
import { STORAGE_KEYS } from '@/config/constants'
import { READER_NAV_GROUPS } from '@/config/navigation'
import { NavLink } from 'react-router-dom'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface ReaderSidebarProps {
 isMobileOpen: boolean
 onMobileClose: () => void
}

export function ReaderSidebar({ isMobileOpen, onMobileClose }: ReaderSidebarProps) {
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
 {t('header.brand', { ns: 'reader' })}
 </p>
 <p
 className="text-xs leading-tight truncate mt-0.5"
 style={{ color: 'var(--color-sidebar-text-muted)' }}
 >
 {t('header.dashboard', { ns: 'reader' })}
 </p>
 </div>
 )}

 {/* Mobile close button */}
 <button
 className="ms-auto lg:hidden p-1 rounded-lg hover:bg-surface/10 transition-colors text-white/70 hover:text-white"
 onClick={onMobileClose}
 aria-label="Close navigation"
 >
 <X size={18} />
 </button>
 </div>

 {/* ── Navigation groups ────────────────────────────── */}
 <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2">
 {READER_NAV_GROUPS.map((group, groupIndex) => (
 <div key={group.key} className={cn(groupIndex > 0 && 'mt-6')}>
 {/* Navigation items */}
 <div className="flex flex-col gap-1">
 {group.items.map((item) => {
 const Icon = (Icons as unknown as Record<string, LucideIcon>)[item.icon]
 return (
 <NavLink
 key={item.key}
 to={item.path}
 end={item.path.endsWith('dashboard')}
 className={({ isActive }) =>
 cn(
 'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all relative',
 isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left',
 isActive
 ? 'bg-surface/10 text-white after:absolute after:inset-block-0 after:inset-inline-start-0 after:w-1 after:rounded-r-full after:bg-[var(--color-sidebar-accent)]'
 : 'text-white/60 hover:text-white hover:bg-surface/5',
 collapsed && 'justify-center px-2'
 )
 }
 >
 <span className="shrink-0">
 {Icon && <Icon size={20} />}
 </span>
 {!collapsed && (
 <span className="truncate leading-none">
 {t(item.labelKey.replace('navigation:', ''), { ns: 'navigation', defaultValue: item.labelKey.replace('navigation:', '') })}
 </span>
 )}
 </NavLink>
 )
 })}
 </div>
 </div>
 ))}
 </nav>

 {/* ── User profile area ────────────────────────────── */}
 <div className="shrink-0 border-t border-white/10 p-3">
 <div
 className={cn(
 'flex items-center gap-3 px-3 py-2 rounded-lg',
 'hover:bg-surface/5 transition-colors cursor-pointer',
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
 {user?.name?.charAt(0)?.toUpperCase() ?? 'R'}
 </div>

 {!collapsed && (
 <div className={cn('min-w-0 flex-1', isRTL ? 'text-right' : 'text-left')}>
 <p
 className="text-sm font-medium leading-tight truncate"
 style={{ color: 'var(--color-on-primary)' }}
 >
 {user?.name ?? t('profile.role', { ns: 'reader' })}
 </p>
 <p
 className="text-xs leading-tight truncate mt-0.5"
 style={{ color: 'var(--color-sidebar-text-muted)' }}
 >
 {t('profile.role', { ns: 'reader' })}
 </p>
 </div>
 )}
 </div>

 {/* Logout button */}
 {!collapsed && (
 <button
 onClick={logout}
 className="w-full mt-2 px-3 py-2 rounded-lg text-sm font-medium text-left"
 style={{ color: 'var(--color-sidebar-text-muted)', textAlign: isRTL ? 'right' : 'left' }}
 onMouseEnter={(e) => {
 e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'
 e.currentTarget.style.color = 'white'
 }}
 onMouseLeave={(e) => {
 e.currentTarget.style.backgroundColor = ''
 e.currentTarget.style.color = 'var(--color-sidebar-text-muted)'
 }}
 >
 {t('logout', { ns: 'navigation' })}
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
