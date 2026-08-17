// ============================================================
// Constants — App-wide constants
// ============================================================

/** LocalStorage keys used by the app */
export const STORAGE_KEYS = {
  LANGUAGE:        'psms_language',
  AUTH_TOKEN:      'psms_auth_token',
  SIDEBAR_COLLAPSED: 'psms_sidebar_collapsed',
} as const

/** API configuration */
export const API_CONFIG = {
  TIMEOUT: 30_000,
  BASE_URL: import.meta.env.VITE_API_BASE_URL as string | undefined,
} as const

/** Navigation sidebar width */
export const SIDEBAR_WIDTH     = 280
export const SIDEBAR_COLLAPSED = 72

/** Header height in px */
export const HEADER_HEIGHT = 64

/** Pagination defaults */
export const DEFAULT_PAGE_SIZE = 15
export const PAGE_SIZE_OPTIONS = [10, 15, 25, 50] as const

/** Date/time formats */
export const DATE_FORMAT      = 'YYYY-MM-DD'
export const DATETIME_FORMAT  = 'YYYY-MM-DD HH:mm'
export const DISPLAY_DATE     = 'DD/MM/YYYY'
