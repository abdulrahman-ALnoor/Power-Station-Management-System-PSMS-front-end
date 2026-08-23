import apiClient from '../api'
import type { ApiResponse } from '@/types/api'
import type { ServiceRequest, PaginatedResponse } from '../../pages/shared/service-requests/types'

export interface GetServiceRequestsParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
  request_type?: string
  priority?: string
  assigned_to?: 'all' | 'me' | 'unassigned'
  created_by?: number
}

const mockCurrentUser = {
  id: 1,
  name: 'المستخدم الحالي',
  role: 'reader'
}

class ServiceRequestService {
  async getServiceRequests(params: GetServiceRequestsParams): Promise<PaginatedResponse<ServiceRequest>> {
    const queryParams: Record<string, any> = {
      page: params.page || 1,
      per_page: params.per_page || 10,
    }

    if (params.search) queryParams.search = params.search
    if (params.status && params.status !== 'all') queryParams.status = params.status
    if (params.request_type && params.request_type !== 'all') queryParams.request_type = params.request_type
    if (params.priority && params.priority !== 'all') queryParams.priority = params.priority

    try {
      const response = await apiClient.get<ApiResponse<any>>('/service-requests', { params: queryParams })
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

      const data: ServiceRequest[] = rawList.map((item) => ({
        id: item.id,
        meter_id: item.meter_id,
        customer_id: item.customer_id,
        created_by: item.created_by || 1,
        assigned_engineer_id: item.assigned_engineer_id || null,
        request_type: item.request_type || 'maintenance',
        priority: item.priority || 'medium',
        status: item.status || 'pending',
        description: item.description || null,
        completed_at: item.completed_at || null,
        created_at: item.created_at,
        updated_at: item.updated_at || item.created_at,
        customer: item.customer ? { id: item.customer.id, full_name: item.customer.full_name || item.customer.name } : undefined,
        meter: item.meter ? { id: item.meter.id, meter_number: item.meter.meter_number } : undefined,
        creator: item.creator ? { id: item.creator.id, name: item.creator.name } : undefined,
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
    } catch {
      return {
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: params.per_page || 10,
        total: 0,
        from: 0,
        to: 0,
      }
    }
  }

  async createServiceRequest(data: any): Promise<ServiceRequest> {
    let response
    try {
      response = await apiClient.post<ApiResponse<any>>('/reader/service-requests', data)
    } catch {
      response = await apiClient.post<ApiResponse<any>>('/service-requests', data)
    }

    const item = response.data.data
    return {
      id: item.id,
      meter_id: item.meter_id,
      customer_id: item.customer_id,
      created_by: item.created_by || 1,
      assigned_engineer_id: item.assigned_engineer_id || null,
      request_type: item.request_type,
      priority: item.priority || null,
      status: item.status || 'pending',
      description: item.description || null,
      completed_at: item.completed_at || null,
      created_at: item.created_at,
      updated_at: item.updated_at || item.created_at,
    }
  }

  async getCustomers() {
    try {
      const response = await apiClient.get<ApiResponse<any[]>>('/customers')
      const raw = response.data.data || []
      return raw.map((c) => ({ id: c.id, full_name: c.full_name || c.name }))
    } catch {
      return []
    }
  }

  async getMetersByCustomer(customerId: number) {
    try {
      const response = await apiClient.get<ApiResponse<any[]>>('/meters')
      const raw = response.data.data || []
      return raw.filter((m) => m.customer_id === customerId).map((m) => ({ id: m.id, meter_number: m.meter_number }))
    } catch {
      return []
    }
  }

  async updateServiceRequestStatus(id: number, status: string): Promise<ServiceRequest> {
    const response = await apiClient.put<ApiResponse<any>>(`/service-requests/${id}`, { status })
    const item = response.data.data
    return {
      id: item.id,
      meter_id: item.meter_id,
      customer_id: item.customer_id,
      created_by: item.created_by || 1,
      assigned_engineer_id: item.assigned_engineer_id || null,
      request_type: item.request_type,
      priority: item.priority || null,
      status: item.status || 'pending',
      description: item.description || null,
      completed_at: item.completed_at || null,
      created_at: item.created_at,
      updated_at: item.updated_at || item.created_at,
    }
  }

  async assignServiceRequestToMe(id: number): Promise<ServiceRequest> {
    const response = await apiClient.put<ApiResponse<any>>(`/service-requests/${id}`, { status: 'assigned' })
    const item = response.data.data
    return {
      id: item.id,
      meter_id: item.meter_id,
      customer_id: item.customer_id,
      created_by: item.created_by || 1,
      assigned_engineer_id: item.assigned_engineer_id || null,
      request_type: item.request_type,
      priority: item.priority || null,
      status: item.status || 'assigned',
      description: item.description || null,
      completed_at: item.completed_at || null,
      created_at: item.created_at,
      updated_at: item.updated_at || item.created_at,
    }
  }

  async updateServiceRequest(id: number, data: any): Promise<ServiceRequest> {
    const response = await apiClient.put<ApiResponse<any>>(`/service-requests/${id}`, data)
    const item = response.data.data
    return {
      id: item.id,
      meter_id: item.meter_id,
      customer_id: item.customer_id,
      created_by: item.created_by || 1,
      assigned_engineer_id: item.assigned_engineer_id || null,
      request_type: item.request_type,
      priority: item.priority || null,
      status: item.status || 'pending',
      description: item.description || null,
      completed_at: item.completed_at || null,
      created_at: item.created_at,
      updated_at: item.updated_at || item.created_at,
    }
  }

  async deleteServiceRequest(id: number): Promise<void> {
    await apiClient.delete(`/service-requests/${id}`)
  }
}

export const serviceRequestService = new ServiceRequestService()
export { mockCurrentUser }
