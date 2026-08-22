// ============================================================
// Auth service — Placeholder for Laravel API auth endpoints
// Will be implemented in Step 2 (Login screen)
// ============================================================

import apiClient from './api'
import type { ApiResponse, LoginResponse } from '@/types/api'

interface LoginCredentials {
 email: string
 password: string
}

/**
 * Authenticate admin user.
 * Placeholder — endpoint will be confirmed in Step 2.
 */
export async function loginRequest(
 credentials: LoginCredentials,
): Promise<LoginResponse> {
 const response = await apiClient.post<ApiResponse<LoginResponse>>(
 '/auth/login',
 credentials,
 )
 return response.data.data
}

/**
 * Logout current user — invalidates token server-side.
 */
export async function logoutRequest(): Promise<void> {
 await apiClient.post('/auth/logout')
}

/**
 * Fetch currently authenticated user profile.
 */
export async function getMeRequest(): Promise<LoginResponse['user']> {
 const response = await apiClient.get<ApiResponse<LoginResponse['user']>>(
 '/auth/me',
 )
 return response.data.data
}
