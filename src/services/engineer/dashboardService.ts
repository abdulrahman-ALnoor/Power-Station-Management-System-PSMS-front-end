import apiClient from '../api'
import type { ApiResponse } from '@/types/api'

export interface EngineerDashboardStatsData {
  totalServiceRequests: number
  completedRequests: number
  pendingRequests: number
  inProgressRequests: number
  cancelledRequests: number
  readyEquipment: number
}

export interface EngineerPerformanceData {
  month: string
  completed: number
}

export interface EngineerRecentRequest {
  id: number
  request_number: string
  meter_number: string
  customer_name: string
  request_type: string
  priority: string
  status: string
  created_at: string
}

export interface EngineerEquipmentStats {
  total: number
  active: number
  maintenance: number
  damaged: number
}

class EngineerDashboardService {
  async getDashboardStats(): Promise<EngineerDashboardStatsData> {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/service-requests/my-dashboard')
      const data = response.data.data || {}
      return {
        totalServiceRequests: Number(data.total_requests) || 0,
        completedRequests: Number(data.completed_requests) || 0,
        pendingRequests: Number(data.pending_requests) || 0,
        inProgressRequests: Number(data.in_progress_requests) || 0,
        cancelledRequests: 0,
        readyEquipment: Number(data.total_equipment) || 0,
      }
    } catch {
      return {
        totalServiceRequests: 0,
        completedRequests: 0,
        pendingRequests: 0,
        inProgressRequests: 0,
        cancelledRequests: 0,
        readyEquipment: 0,
      }
    }
  }

  async getPerformanceData(): Promise<EngineerPerformanceData[]> {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/service-requests/my-performance')
      const raw = response.data.data || []
      if (Array.isArray(raw)) {
        return raw.map((item: any) => ({
          month: item.month || 'الشهر',
          completed: Number(item.total) || 0,
        }))
      }
      return []
    } catch {
      return []
    }
  }

  async getLatestRequests(): Promise<EngineerRecentRequest[]> {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/service-requests/my-latest')
      const raw = response.data.data || []
      let list: any[] = []
      if (Array.isArray(raw)) {
        list = raw
      } else if (raw && Array.isArray(raw.data)) {
        list = raw.data
      }

      return list.map((item) => ({
        id: item.id,
        request_number: item.request_number || `SR-${String(item.id).padStart(4, '0')}`,
        meter_number: item.meter?.meter_number || `عداد #${item.meter_id || item.id}`,
        customer_name: item.customer?.full_name || item.customer?.name || 'عميل غير محدد',
        request_type: item.request_type || item.type || 'صيانة',
        priority: item.priority || 'medium',
        status: item.status || 'pending',
        created_at: item.created_at || new Date().toISOString(),
      }))
    } catch {
      return []
    }
  }

  async getEquipmentStats(): Promise<EngineerEquipmentStats> {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/equipment/my-stats')
      const data = response.data.data || {}
      const byStatus = data.by_status || {}
      return {
        total: Number(data.total_equipment) || 0,
        active: Number(byStatus.active || byStatus.available) || 0,
        maintenance: Number(byStatus.maintenance || byStatus.in_maintenance) || 0,
        damaged: Number(byStatus.damaged) || 0,
      }
    } catch {
      return { total: 0, active: 0, maintenance: 0, damaged: 0 }
    }
  }
}

export const engineerDashboardService = new EngineerDashboardService()
