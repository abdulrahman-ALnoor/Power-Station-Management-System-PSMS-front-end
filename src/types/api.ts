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
