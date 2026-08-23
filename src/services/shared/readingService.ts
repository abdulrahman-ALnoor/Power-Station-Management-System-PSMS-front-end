import apiClient from '../api'
import type { ApiResponse } from '@/types/api'
import type { MeterReading, PaginatedResponse } from '../../pages/shared/readings/types'

export interface GetReadingsParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
  method?: string
  date?: string
}

class ReadingService {
  async getReadings(params: GetReadingsParams): Promise<PaginatedResponse<MeterReading>> {
    const queryParams: Record<string, any> = {
      page: params.page || 1,
      per_page: params.per_page || 10,
    }

    if (params.search) queryParams.search = params.search
    if (params.status && params.status !== 'all') queryParams.status = params.status
    if (params.method && params.method !== 'all') queryParams.method = params.method
    if (params.date && params.date !== 'all') queryParams.date = params.date

    let response
    try {
      response = await apiClient.get<ApiResponse<any>>('/reader/readings', { params: queryParams })
    } catch {
      response = await apiClient.get<ApiResponse<any>>('/meter-readings', { params: queryParams })
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

    const data: MeterReading[] = rawList.map((item) => ({
      id: item.id,
      meter_id: item.meter_id,
      previous_reading: Number(item.previous_reading) || 0,
      current_reading: Number(item.current_reading) || 0,
      consumption: Number(item.consumption) || 0,
      price_per_kwh: Number(item.price_per_kwh) || 0,
      reading_cost: Number(item.reading_cost) || 0,
      reading_date: item.reading_date || item.created_at,
      reading_method: item.reading_method || 'manual',
      status: item.status || 'approved',
      notes: item.notes || null,
      created_by: item.created_by || 1,
      created_at: item.created_at,
      updated_at: item.updated_at || item.created_at,
      meter: item.meter
        ? {
            id: item.meter.id,
            meter_number: item.meter.meter_number,
            customer: item.meter.customer
              ? {
                  id: item.meter.customer.id,
                  full_name: item.meter.customer.full_name || item.meter.customer.name,
                }
              : item.customer
              ? {
                  id: item.customer.id,
                  full_name: item.customer.full_name || item.customer.name,
                }
              : undefined,
          }
        : undefined,
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
}

export const readingService = new ReadingService()
