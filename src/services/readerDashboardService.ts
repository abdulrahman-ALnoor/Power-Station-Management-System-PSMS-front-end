import apiClient from './api'
import type { ApiResponse } from '@/types/api'
import type { ReaderDashboardResponse, ReaderReading } from '@/pages/reader/dashboard/types/readerDashboard.types'
import { getDaysInMonth } from 'date-fns'

interface LaravelReaderStats {
  total_readings: number
  current_month_readings: number
}

interface LaravelReaderProgress {
  assigned_meters: number
  completed_readings: number
  progress_percentage: number
}

interface LaravelReaderConsumption {
  total_consumption: number
  average_consumption: number
}

interface LaravelMeterReadingItem {
  id: number
  meter?: { meter_number?: string; customer?: { full_name?: string } }
  previous_reading: number | string
  current_reading: number | string
  consumption: number | string
  reading_date: string
  status: string
}

class ReaderDashboardService {
  async getDashboardData(): Promise<ReaderDashboardResponse> {
    try {
      const [statsRes, progressRes, consumptionRes, latestRes, serviceRequestsRes] = await Promise.all([
        apiClient.get<ApiResponse<LaravelReaderStats>>('/reader/dashboard/stats').catch(() => null),
        apiClient.get<ApiResponse<LaravelReaderProgress>>('/reader/dashboard/progress').catch(() => null),
        apiClient.get<ApiResponse<LaravelReaderConsumption>>('/reader/dashboard/consumption').catch(() => null),
        apiClient.get<ApiResponse<LaravelMeterReadingItem[]>>('/reader/dashboard/latest-readings').catch(() => null),
        apiClient.get<ApiResponse<any>>('/service-requests').catch(() => null),
      ])

      const statsData = statsRes?.data?.data
      const progressData = progressRes?.data?.data
      const consumptionData = consumptionRes?.data?.data
      const latestData = latestRes?.data?.data || []
      const serviceRequestsData = serviceRequestsRes?.data?.data

      let serviceRequestsCount = 0
      if (Array.isArray(serviceRequestsData)) {
        serviceRequestsCount = serviceRequestsData.length
      } else if (serviceRequestsData && Array.isArray(serviceRequestsData.data)) {
        serviceRequestsCount = serviceRequestsData.total || serviceRequestsData.data.length
      }

      const totalReadings = Number(statsData?.total_readings) || 0
      const currentMonthReadings = Number(statsData?.current_month_readings) || 0

      const assignedMeters = Number(progressData?.assigned_meters) || 0
      const completedReadings = Number(progressData?.completed_readings) || 0
      const progressPercentage = Number(progressData?.progress_percentage) || 0

      const totalConsumption = Number(consumptionData?.total_consumption) || 0
      const avgConsumption = Number(consumptionData?.average_consumption) || 0

      const mappedLatestReadings: ReaderReading[] = latestData.map((item) => ({
        id: String(item.id),
        meterNumber: item.meter?.meter_number || `عداد #${item.id}`,
        customerName: item.meter?.customer?.full_name || 'عميل غير معروف',
        previousReading: Number(item.previous_reading) || 0,
        currentReading: Number(item.current_reading) || 0,
        consumption: `${Number(item.consumption) || 0} kWh`,
        date: item.reading_date || new Date().toISOString(),
        status: item.status === 'approved' ? 'completed' : item.status === 'pending' ? 'review' : 'late',
      }))

      // Create consumption chart dataset
      const today = new Date()
      const daysCount = getDaysInMonth(today)
      const consumptionChart = Array.from({ length: Math.min(7, daysCount) }, (_, i) => ({
        day: `يوم ${i + 1}`,
        consumption: Math.round(avgConsumption > 0 ? avgConsumption : totalConsumption / 7),
      }))

      return {
        stats: {
          totalReadings,
          todayReadings: currentMonthReadings,
          overdueReadings: Math.max(0, assignedMeters - completedReadings),
          serviceRequests: serviceRequestsCount,
        },
        progress: {
          completed: completedReadings,
          total: assignedMeters,
          percentage: progressPercentage,
        },
        latestReadings: mappedLatestReadings,
        notifications: [],
        consumptionChart,
      }
    } catch {
      return {
        stats: { totalReadings: 0, todayReadings: 0, overdueReadings: 0, serviceRequests: 0 },
        progress: { completed: 0, total: 0, percentage: 0 },
        latestReadings: [],
        notifications: [],
        consumptionChart: [],
      }
    }
  }
}

export const readerDashboardService = new ReaderDashboardService()
