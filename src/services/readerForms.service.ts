import apiClient from './api'
import type { ApiResponse } from '@/types/api'
import type {
  MockMeterInfo,
  CreateMeterReadingPayload,
  CreateServiceRequestPayload,
} from '../pages/reader/dashboard/types/readerForms.types'

interface LaravelMeterItem {
  id: number
  meter_number: string
  customer?: { id: number; full_name?: string; name?: string; phone?: string }
}

export async function getReaderMeters(): Promise<MockMeterInfo[]> {
  try {
    const response = await apiClient.get<ApiResponse<any>>('/meters')
    const raw = response.data.data

    let rawList: LaravelMeterItem[] = []
    if (Array.isArray(raw)) {
      rawList = raw
    } else if (raw && Array.isArray(raw.data)) {
      rawList = raw.data
    }

    return rawList.map((m) => ({
      id: m.id,
      meterNumber: m.meter_number,
      customer: {
        id: m.customer?.id || 0,
        name: m.customer?.full_name || m.customer?.name || `عميل #${m.id}`,
        phone: m.customer?.phone || 'غير مسجل',
      },
      previousReading: 0, // Server calculates exact previous_reading automatically
      pricePerKwh: 250,
    }))
  } catch {
    return []
  }
}

export async function submitMeterReading(
  payload: CreateMeterReadingPayload,
): Promise<{ success: boolean }> {
  const body = {
    meter_id: payload.meter_id,
    current_reading: payload.current_reading,
    reading_date: payload.reading_date,
    reading_method: payload.reading_method,
    notes: payload.notes || undefined,
  }

  await apiClient.post('/meter-readings', body)
  return { success: true }
}

export async function submitServiceRequest(
  payload: CreateServiceRequestPayload,
): Promise<{ success: boolean }> {
  const body = {
    meter_id: payload.meter_id,
    customer_id: payload.customer_id,
    request_type: payload.request_type,
    priority: payload.priority,
    description: payload.description || undefined,
  }

  try {
    await apiClient.post('/reader/service-requests', body)
  } catch {
    // Fallback to standard endpoint if reader specific route returns 404
    await apiClient.post('/service-requests', body)
  }

  return { success: true }
}
