// ============================================================
// API response type shapes — placeholder until backend is ready
// ============================================================

/** Standard Laravel API success response wrapper */
export interface ApiResponse<T = unknown> {
 success: boolean
 message?: string
 data: T
}

/** Standard Laravel validation error shape */
export interface ApiValidationError {
 message: string
 errors: Record<string, string[]>
}

/** Generic API error */
export interface ApiError {
 message: string
 status: number
 errors?: Record<string, string[]>
}

/** Shape returned by the real Laravel /login and /me endpoints */
export interface LoginUserInfo {
  id: number
  name: string
  email: string
  role: string
  permissions: string[]
}

/** Login response — matches AuthController@login data payload exactly */
export interface LoginResponse {
  user_info: LoginUserInfo
  token: string
}

export interface LaravelPaginated<T> {
  current_page: number
  data: T[]
  first_page_url: string
  from: number | null
  last_page: number
  last_page_url: string
  links: {
    url: string | null
    label: string
    active: boolean
  }[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number | null
  total: number
}
