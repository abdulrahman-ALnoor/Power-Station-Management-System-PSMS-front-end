// ============================================================
// Auth service — Real Laravel API auth endpoints
// Connected in Step 1.2 (backend integration)
// ============================================================

import apiClient from './api'
import type { ApiResponse, LoginResponse, LoginUserInfo } from '@/types/api'

interface LoginCredentials {
 email: string
 password: string
}

/**
 * Authenticate admin user.
 * Backend route: POST /api/login (public, no auth required)
 */
export async function loginRequest(
 credentials: LoginCredentials,
): Promise<LoginResponse> {
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    '/login',
    credentials,
  )
  return response.data.data
}

/**
 * Logout current user — invalidates token server-side.
 * Backend route: POST /api/logout (auth:sanctum)
 */
export async function logoutRequest(): Promise<void> {
  await apiClient.post('/logout')
}

/**
 * Fetch currently authenticated user profile (id, name, email, role, permissions).
 * Backend route: GET /api/me (auth:sanctum)
 * Used on app load to validate a token already saved in localStorage.
 */
export async function getMeRequest(): Promise<LoginUserInfo> {
  const response = await apiClient.get<ApiResponse<LoginUserInfo>>('/me')
  return response.data.data
}
