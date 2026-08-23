import apiClient from '../api'
import type { ApiResponse } from '@/types/api'
import type { Equipment, PaginatedResponse, EquipmentStatus } from '../../pages/shared/equipment/types'

export interface GetEquipmentParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
}

class EquipmentService {
  async getEquipment(params: GetEquipmentParams): Promise<PaginatedResponse<Equipment>> {
    const queryParams: Record<string, any> = {
      page: params.page || 1,
      per_page: params.per_page || 10,
    }

    if (params.search) queryParams.search = params.search
    if (params.status && params.status !== 'all') queryParams.status = params.status

    let response
    try {
      response = await apiClient.get<ApiResponse<any>>('/reader/equipment', { params: queryParams })
    } catch {
      response = await apiClient.get<ApiResponse<any>>('/equipment', { params: queryParams })
    }

    const raw = response.data.data

    let rawList: any[] = []
    let currentPage = 1
    let lastPage = 1
    let perPage = params.per_page || 10
    let total = 0

    if (Array.isArray(raw)) {
      rawList = raw
      total = rawList.length
    } else if (raw && Array.isArray(raw.data)) {
      rawList = raw.data
      currentPage = raw.current_page || 1
      lastPage = raw.last_page || 1
      perPage = raw.per_page || 10
      total = raw.total || rawList.length
    }

    const data: Equipment[] = rawList.map((item) => ({
      id: item.id,
      user_id: item.user_id || null,
      equipment_name: item.equipment_name || item.name || 'معدة',
      serial_number: item.serial_number || null,
      status: item.status || 'available',
      notes: item.notes || null,
      created_by: item.created_by || 1,
      created_at: item.created_at,
      updated_at: item.updated_at || item.created_at,
      user: item.user ? { id: item.user.id, name: item.user.name } : null,
      creator: item.creator ? { id: item.creator.id, name: item.creator.name } : { id: 1, name: 'مدير' },
    }))

    return {
      data,
      current_page: currentPage,
      last_page: lastPage,
      per_page: perPage,
      total,
      from: (currentPage - 1) * perPage + 1,
      to: Math.min(currentPage * perPage, total),
    }
  }

  async createEquipment(data: Partial<Equipment>): Promise<Equipment> {
    const response = await apiClient.post<ApiResponse<any>>('/equipment', data)
    const item = response.data.data
    return {
      id: item.id,
      user_id: item.user_id || null,
      equipment_name: item.equipment_name || item.name || '',
      serial_number: item.serial_number || null,
      status: item.status || 'available',
      notes: item.notes || null,
      created_by: item.created_by || 1,
      created_at: item.created_at,
      updated_at: item.updated_at || item.created_at,
    }
  }

  async updateEquipmentStatus(id: number, status: EquipmentStatus): Promise<Equipment> {
    const response = await apiClient.put<ApiResponse<any>>(`/equipment/${id}`, { status })
    const item = response.data.data
    return {
      id: item.id,
      user_id: item.user_id || null,
      equipment_name: item.equipment_name || item.name || '',
      serial_number: item.serial_number || null,
      status: item.status || 'available',
      notes: item.notes || null,
      created_by: item.created_by || 1,
      created_at: item.created_at,
      updated_at: item.updated_at || item.created_at,
    }
  }

  async getUsers() {
    try {
      const response = await apiClient.get<ApiResponse<any[]>>('/users')
      const raw = response.data.data || []
      return raw.map((u) => ({ id: u.id, name: u.name }))
    } catch {
      return []
    }
  }
}

export const equipmentService = new EquipmentService()
