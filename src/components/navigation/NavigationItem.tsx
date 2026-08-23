// ============================================================
// NavigationItem — Sidebar navigation item
// Supports RTL/LTR, active state, icon, badge
// ============================================================

import { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/utils/cn'

import type { NavItem } from '@/types/common'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

interface NavigationItemProps {
 item: NavItem
 collapsed?: boolean
}

// Dynamically resolve Lucide icon by string name
function DynamicIcon({
 name,
 size = 20,
}: {
 name: string
 size?: number
}) {
 const Icon = (Icons as unknown as Record<string, LucideIcon>)[name]

 if (!Icon) {
 return null
 }

 return <Icon size={size} aria-hidden="true" />
}

export function NavigationItem({ item, collapsed = false }: NavigationItemProps) {
 const { t, isRTL } = useLanguage('navigation')

 // Resolve translation key — strip 'navigation:' prefix if present
 const label = useMemo(() => {
 const key = item.labelKey.replace('navigation:', '')
 return t(key, { ns: 'navigation', defaultValue: key })
 }, [item.labelKey, t])

 return (
 <NavLink
 to={item.path}
 end={item.path.endsWith('dashboard')}
 className={({ isActive }) =>
 cn(
 // Base styles
 'flex items-center gap-3 px-4 py-2.5 rounded-lg',
 'text-sm font-medium transition-all duration-200',
 'relative group',
 // Direction
 isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left',
 // Default state
 'text-white/70 hover:text-white hover:bg-surface/5',
 // Active state
 isActive && [
 'text-[var(--color-sidebar-accent)] bg-surface/10',
 // Gold indicator bar — on the inlineStart side (right in RTL, left in LTR)
 'after:absolute after:inset-block-0 after:inset-inline-start-0',
 'after:w-1 after:rounded-r-full',
 'after:bg-[var(--color-sidebar-accent)]',
 ],
 // Collapsed: center icons
 collapsed && 'justify-center px-2',
 )
 }
 aria-label={label}
 >
 {/* Icon */}
 <span className="shrink-0 text-current">
 <DynamicIcon name={item.icon} size={20} />
 </span>

 {/* Label — hidden when sidebar is collapsed */}
 {!collapsed && (
 <span className="truncate leading-none">{label}</span>
 )}

 {/* Badge */}
 {!collapsed && item.badge != null && item.badge > 0 && (
 <span
 className="ms-auto shrink-0 min-w-5 h-5 px-1 rounded-full text-xs font-bold flex items-center justify-center"
 style={{
 background: 'var(--color-sidebar-accent)',
 color: 'var(--color-on-accent)',
 }}
 >
 {item.badge > 99 ? '99+' : item.badge}
 </span>
 )}

 {/* Tooltip when collapsed */}
 {collapsed && (
 <span
 className={cn(
 'absolute z-50 px-2 py-1 text-xs font-medium rounded whitespace-nowrap',
 'bg-gray-900 text-white pointer-events-none opacity-0 group-hover:opacity-100',
 'transition-opacity duration-150',
 isRTL
 ? 'right-full me-2 top-1/2 -translate-y-1/2'
 : 'left-full ms-2 top-1/2 -translate-y-1/2',
 )}
 role="tooltip"
 >
 {label}
 </span>
 )}
 </NavLink>
 )
}
