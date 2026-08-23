// ============================================================
// Employees service — backend routes (routes/api.php + UserController):
//   GET    /users             -> flat Laravel paginator
//   GET    /users/{id}        -> user with `roles` relation
//   POST   /users             -> create + assign role
//   PUT    /users/{id}        -> update + optionally sync role
//   DELETE /users/{id}
//   GET    /users/stats
// ============================================================

import apiClient from './api'

import type {
  ApiResponse,
  LaravelPaginated,
} from '@/types/api'

import type {
  Employee,
  EmployeeStatus,
} from '@/pages/admin/employees/types'


// ============================================================
// Employee API Record
// ============================================================

export interface EmployeeApiRecord {
  id: number
  name: string
  email: string
  phone: string | null
  status: EmployeeStatus | null

  roles: {
    id: number
    name: string
    guard_name: string
  }[]

  created_at: string
  updated_at: string
}


// ============================================================
// Map Employee
// ============================================================

export function mapEmployee(
  raw: EmployeeApiRecord,
): Employee {
  return {
    id: String(raw.id),

    name: raw.name,

    email: raw.email,

    phone: raw.phone ?? '',

    status:
      (raw.status as EmployeeStatus) ??
      'active',

    roles:
      (raw.roles ?? []).map(
        (role) => role.name,
      ),
  }
}


// ============================================================
// Employees List
// ============================================================

export interface EmployeesListParams {
  page?: number
  per_page?: number
  search?: string
  role?: string
  status?: EmployeeStatus
}


export async function fetchEmployees(
  params: EmployeesListParams = {},
): Promise<
  LaravelPaginated<EmployeeApiRecord>
> {
  const response =
    await apiClient.get<
      ApiResponse<
        LaravelPaginated<EmployeeApiRecord>
      >
    >(
      '/users',
      {
        params,
      },
    )

  return response.data.data
}


// ============================================================
// Get Single Employee
// ============================================================

export async function fetchEmployee(
  id: number | string,
): Promise<EmployeeApiRecord> {
  const response =
    await apiClient.get<
      ApiResponse<EmployeeApiRecord>
    >(
      `/users/${id}`,
    )

  return response.data.data
}


// ============================================================
// Employee Statistics
// ============================================================

export interface EmployeeStatsResponse {
  total_employees: number
  active_employees: number
  inactive_employees: number

  by_role:
    Record<string, number>
}


export async function fetchEmployeeStats():
  Promise<EmployeeStatsResponse> {

  const response =
    await apiClient.get<
      ApiResponse<EmployeeStatsResponse>
    >(
      '/users/stats',
    )

  return response.data.data
}


// ============================================================
// Create Employee
// ============================================================

export interface CreateEmployeePayload {
  name: string

  email: string

  password: string

  phone?: string

  status?: EmployeeStatus

  role:
    | 'admin'
    | 'engineer'
    | 'accountant'
    | 'reader'
}


export async function createEmployee(
  payload: CreateEmployeePayload,
): Promise<EmployeeApiRecord> {

  const response =
    await apiClient.post<
      ApiResponse<EmployeeApiRecord>
    >(
      '/users',
      payload,
    )

  return response.data.data
}


// ============================================================
// Update Employee
// ============================================================

export interface UpdateEmployeePayload {
  name?: string

  email?: string

  phone?: string

  status?: EmployeeStatus

  role?:
    | 'admin'
    | 'engineer'
    | 'accountant'
    | 'reader'

  // كلمة المرور اختيارية أثناء التعديل
  password?: string
}


// تعديل بيانات الموظف
export async function updateEmployee(
  id: number | string,
  payload: UpdateEmployeePayload,
): Promise<EmployeeApiRecord> {

  const response =
    await apiClient.put<
      ApiResponse<EmployeeApiRecord>
    >(
      `/users/${id}`,
      payload,
    )

  return response.data.data
}


// ============================================================
// Delete Employee
// ============================================================

export async function deleteEmployee(
  id: number | string,
): Promise<void> {

  await apiClient.delete(
    `/users/${id}`,
  )
}