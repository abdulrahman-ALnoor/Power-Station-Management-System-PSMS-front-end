// ============================================================
// API service layer — Axios instance
// All API calls go through this instance — never directly in components
// ============================================================

import axios, { type AxiosError, type AxiosResponse } from 'axios'
import { STORAGE_KEYS, API_CONFIG } from '@/config/constants'
import type { ApiError } from '@/types/api'

/** Shared Axios instance with base configuration */
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL ?? '/api',
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ── Request interceptor: attach auth token ──────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response interceptor: normalize errors ──────────────────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status ?? 0

    // Handle 401 Unauthorized — clear token
    if (status === 401) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      // Defer redirect so components can react
      window.dispatchEvent(new CustomEvent('psms:session-expired'))
    }

    const apiError: ApiError = {
      message:
        (error.response?.data as { message?: string })?.message ??
        error.message ??
        'Unknown error',
      status,
      errors:
        (error.response?.data as { errors?: Record<string, string[]> })
          ?.errors,
    }

    return Promise.reject(apiError)
  },
)

export default apiClient
