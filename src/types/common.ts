// ============================================================
// Common shared types for PSMS frontend
// ============================================================

/** Supported UI languages */
export type Language = 'ar' | 'en'

/** Text direction based on language */
export type Direction = 'rtl' | 'ltr'

/** Maps a language code to its direction */
export const LANGUAGE_DIRECTION: Record<Language, Direction> = {
  ar: 'rtl',
  en: 'ltr',
}

/** Maps a language code to its display label */
export const LANGUAGE_LABELS: Record<Language, string> = {
  ar: 'العربية',
  en: 'English',
}

/** Generic paginated API list response */
export interface PaginatedList<T> {
  data: T[]
  meta: PaginationMeta
}

export interface PaginationMeta {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
}

/** Generic select option */
export interface SelectOption<T = string> {
  label: string
  value: T
  disabled?: boolean
}

/** Status badge variants */
export type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'accent'

/** Size variants shared across components */
export type SizeVariant = 'sm' | 'md' | 'lg'

/** Navigation item definition (typed, data-driven) */
export interface NavItem {
  key: string
  labelKey: string          // i18n key
  icon: string              // Lucide icon name
  path: string
  children?: NavItem[]
  permission?: string       // Future: permission key for RBAC
  badge?: number            // Optional notification count
}

/** Navigation group */
export interface NavGroup {
  key: string
  labelKey: string
  items: NavItem[]
}

/** User roles — must match Spatie role names seeded in the backend (PermissionSeeder) */
export type UserRole = 'admin' | 'engineer' | 'accountant' | 'reader'

/** Authenticated user shape — matches backend user_info */
export interface AuthUser {
  id: number
  name: string
  email: string
  role: UserRole
  permissions: string[]
  avatarUrl?: string
}