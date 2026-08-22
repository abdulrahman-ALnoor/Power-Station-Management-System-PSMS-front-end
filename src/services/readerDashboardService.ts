import { ServiceRequest, Meter, Reading } from '@/types/common'

export interface ReaderDashboardStats {
  totalReadings: number
  todayReadings: number
  overdueReadings: number
  serviceRequests: number
}

export interface ReaderDashboardResponse {
  stats: ReaderDashboardStats
  recentReadings: Reading[]
  pendingMeters: Meter[]
  recentServiceRequests: ServiceRequest[]
}

// Mock service data
const mockDashboardData: ReaderDashboardResponse = {
  stats: {
    totalReadings: 1245,
    todayReadings: 42,
    overdueReadings: 8,
    serviceRequests: 12,
  },
  recentReadings: [
    {
      id: 101,
      meter_id: 1,
      user_id: 2,
      reading_date: new Date().toISOString(),
      previous_reading: 1000,
      current_reading: 1050,
      consumption: 50,
      status: 'completed',
      reading_image: null,
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 102,
      meter_id: 2,
      user_id: 2,
      reading_date: new Date(Date.now() - 86400000).toISOString(), // yesterday
      previous_reading: 2000,
      current_reading: 2120,
      consumption: 120,
      status: 'under_review',
      reading_image: null,
      notes: null,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
    }
  ],
  pendingMeters: [
    {
      id: 3,
      meter_number: 'MTR-789012',
      customer_id: 3,
      location: 'شارع الملك فهد, العمارة أ',
      installation_date: '2022-03-10',
      status: 'active',
      created_at: '2022-03-10T10:00:00Z',
      updated_at: '2023-01-01T10:00:00Z',
    },
    {
      id: 4,
      meter_number: 'MTR-345678',
      customer_id: 4,
      location: 'حي النفل, المنطقة ب',
      installation_date: '2023-01-15',
      status: 'active',
      created_at: '2023-01-15T09:00:00Z',
      updated_at: '2023-01-15T09:00:00Z',
    }
  ],
  recentServiceRequests: [
    {
      id: 201,
      meter_id: 1,
      customer_id: 1,
      created_by: 2,
      assigned_engineer_id: 3,
      request_type: 'maintenance',
      priority: 'high',
      status: 'in_progress',
      description: 'عداد يفصل الكهرباء باستمرار',
      created_at: new Date(Date.now() - 10000000).toISOString(),
      updated_at: new Date(Date.now() - 5000000).toISOString(),
      completed_at: null,
      customer: {
        id: 1,
        full_name: 'أحمد محمود',
        phone_number: '0501234567',
        email: 'ahmed@example.com',
        address: 'حي الملك فهد'
      } as any,
      meter: {
        id: 1,
        meter_number: 'MTR-123456'
      } as any,
    }
  ]
}

class ReaderDashboardService {
  async getDashboardData(): Promise<ReaderDashboardResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    return mockDashboardData
  }
}

export const readerDashboardService = new ReaderDashboardService()
