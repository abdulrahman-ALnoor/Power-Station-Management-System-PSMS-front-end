// ============================================================
// Equipment service — backend routes (routes/api.php + EquipmentController):
//   GET    /equipment           -> flat Laravel paginator (index does NOT wrap in Resource)
//   GET    /equipment/{id}      -> EquipmentResource (single object)
//   POST   /equipment           -> EquipmentResource
//   PUT    /equipment/{id}      -> EquipmentResource
//   DELETE /equipment/{id}
//   GET    /equipments/stats    -> note the plural "equipments" here specifically
// ============================================================

import apiClient from './api'
import type { ApiResponse, LaravelPaginated } from '@/types/api'
import type { Equipment, EquipmentStatus } from '@/pages/admin/equipment/types'

/** Raw shape for list results — index() returns the raw Eloquent model + relations, unwrapped. */
export interface EquipmentApiRecord {
  id: number
  user_id: number | null
  equipment_name: string
  serial_number: string | null
  status: EquipmentStatus | null
  notes: string | null
  created_by: number | null
  created_at: string
  updated_at: string
  user?: { id: number; name: string } | null
  creator?: { id: number; name: string } | null
}

export function mapEquipment(raw: EquipmentApiRecord): Equipment {
  return {
    id: raw.id,
    user_id: raw.user_id,
    equipment_name: raw.equipment_name,
    serial_number: raw.serial_number,
    status: raw.status,
    notes: raw.notes,
    created_by: raw.created_by,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    user: raw.user ? { id: raw.user.id, name: raw.user.name } : undefined,
    createdBy: raw.creator ? { id: raw.creator.id, name: raw.creator.name } : undefined,
  }
}

export interface EquipmentListParams {
  page?: number
  search?: string
  status?: EquipmentStatus
}

export async function fetchEquipmentList(
  params: EquipmentListParams = {},
): Promise<LaravelPaginated<EquipmentApiRecord>> {
  const response = await apiClient.get<ApiResponse<LaravelPaginated<EquipmentApiRecord>>>(
    '/equipment',
    { params },
  )
  return response.data.data
}

export async function fetchEquipmentById(id: number): Promise<EquipmentApiRecord> {
  const response = await apiClient.get<ApiResponse<EquipmentApiRecord>>(`/equipment/${id}`)
  return response.data.data
}

export interface EquipmentStatsResponse {
  total_equipment: number
  by_status: Partial<Record<EquipmentStatus, number>>
}

export async function fetchEquipmentStats(): Promise<EquipmentStatsResponse> {
  // Note: this specific endpoint is plural "equipments" on the backend.
  const response = await apiClient.get<ApiResponse<EquipmentStatsResponse>>('/equipments/stats')
  return response.data.data
}

export interface CreateEquipmentPayload {
  user_id?: number | null
  equipment_name: string
  serial_number?: string | null
  status?: EquipmentStatus
  notes?: string | null
  created_by?: number | null
}

export async function createEquipment(payload: CreateEquipmentPayload): Promise<EquipmentApiRecord> {
  const response = await apiClient.post<ApiResponse<EquipmentApiRecord>>('/equipment', payload)
  return response.data.data
}

export async function updateEquipment(
  id: number,
  payload: Partial<CreateEquipmentPayload>,
): Promise<EquipmentApiRecord> {
  const response = await apiClient.put<ApiResponse<EquipmentApiRecord>>(`/equipment/${id}`, payload)
  return response.data.data
}

export async function deleteEquipment(id: number): Promise<void> {
  await apiClient.delete(`/equipment/${id}`)
}
