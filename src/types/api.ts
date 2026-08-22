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

/** Login response placeholder */
export interface LoginResponse {
 token: string
 token_type: string
 expires_in: number
 user: {
 id: number
 name: string
 email: string
 role: string
 }
}
