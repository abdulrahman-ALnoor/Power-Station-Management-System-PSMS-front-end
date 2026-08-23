// ============================================================
// Employees service — backend routes (routes/api.php + UserController):
//   GET    /users             -> flat Laravel paginator (raw User models, no Resource wrap)
//   GET    /users/{id}        -> raw User model with `roles` relation
//   POST   /users             -> create + assign role
//   PUT    /users/{id}        -> update + optionally sync role
//   DELETE /users/{id}
//   GET    /users/stats
// Note: the backend returns the RAW Eloquent User model (with a `roles`
// array of Spatie role objects), not a slim custom shape.
// ============================================================

import apiClient from './api'
import type { ApiResponse,LaravelPaginated } from '@/types/api'
import type { Employee, EmployeeStatus } from '@/pages/admin/employees/types'

/** Raw shape returned for a user — the actual Eloquent User model + roles relation. */
export interface EmployeeApiRecord {
  id: number
  name: string
  email: string
  phone: string | null
  status: EmployeeStatus | null
  roles: { id: number; name: string; guard_name: string }[]
  created_at: string
  updated_at: string
}

/** Maps the backend's raw user+roles record into the frontend's `Employee` type. */
export function mapEmployee(raw: EmployeeApiRecord): Employee {
  return {
    id: String(raw.id),
    name: raw.name,
    email: raw.email,
    phone: raw.phone ?? '',
    status: (raw.status as EmployeeStatus) ?? 'active',
    roles: (raw.roles ?? []).map((r) => r.name),
  }
}

export interface EmployeesListParams {
  page?: number
  per_page?: number
  search?: string
  role?: string
  status?: EmployeeStatus
}

export async function fetchEmployees(
  params: EmployeesListParams = {},
): Promise<LaravelPaginated<EmployeeApiRecord>> {
  const response = await apiClient.get<ApiResponse<LaravelPaginated<EmployeeApiRecord>>>(
    '/users',
    { params },
  )
  return response.data.data
}

export async function fetchEmployee(id: number | string): Promise<EmployeeApiRecord> {
  const response = await apiClient.get<ApiResponse<EmployeeApiRecord>>(`/users/${id}`)
  return response.data.data
}

export interface EmployeeStatsResponse {
  total_employees: number
  active_employees: number
  inactive_employees: number
  by_role: Record<string, number>
}

export async function fetchEmployeeStats(): Promise<EmployeeStatsResponse> {
  const response = await apiClient.get<ApiResponse<EmployeeStatsResponse>>('/users/stats')
  return response.data.data
}

export interface CreateEmployeePayload {
  name: string
  email: string
  password: string
  phone?: string
  status?: EmployeeStatus
  role: 'admin' | 'engineer' | 'accountant' | 'reader'
}

export async function createEmployee(payload: CreateEmployeePayload): Promise<EmployeeApiRecord> {
  const response = await apiClient.post<ApiResponse<EmployeeApiRecord>>('/users', payload)
  return response.data.data
}

export async function updateEmployee(
  id: number | string,
  payload: Partial<CreateEmployeePayload>,
): Promise<EmployeeApiRecord> {
  const response = await apiClient.put<ApiResponse<EmployeeApiRecord>>(`/users/${id}`, payload)
  return response.data.data
}

export async function deleteEmployee(id: number | string): Promise<void> {
  await apiClient.delete(`/users/${id}`)
}
