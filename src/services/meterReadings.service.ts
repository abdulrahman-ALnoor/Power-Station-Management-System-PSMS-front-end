// ============================================================
// Meter Readings service — backend routes (routes/api.php + MeterReadingController):
//   GET    /meter-readings          -> flat Laravel paginator (requires backend index() fix,
//                                       see step below — same pagination-meta bug as /meters)
//   GET    /meter-readings/{id}     -> MeterReadingResource
//   POST   /meter-readings          -> MeterReadingResource (previous_reading, price_per_kwh
//                                       and consumption/cost are ALL calculated server-side)
//   PUT    /meter-readings/{id}     -> MeterReadingResource (only the *last* reading for a
//                                       meter can be edited, and only before an invoice exists
//                                       for it — server enforces this and returns a 422 error
//                                       otherwise; requires backend UpdateMeterReadingRequest
//                                       fix to accept `status`, see step below)
//   DELETE /meter-readings/{id}
//   GET    /meter-readings/stats    -> { total_readings, total_consumption, expected_revenue,
//                                         approved_readings, pending_readings, rejected_readings,
//                                         this_month_consumption, this_month_revenue }
//
// NOTE: the index endpoint only supports filtering by `search`, `status`, `year`, `month`,
// `day` — there is no `method` (manual/qr_scan) filter server-side.
// ============================================================

import apiClient from './api'
import type { ApiResponse,LaravelPaginated } from '@/types/api'
import type {
  MeterReading,
  ReadingStatus,
  ReadingMethod,
  CreateReadingPayload,
  UpdateReadingPayload,
} from '@/pages/admin/readings/types'

/** Raw shape for a single reading, as returned by MeterReadingResource. */
export interface MeterReadingApiRecord {
  id: number
  meter: {
    id: number | null
    meter_number: string | null
    customer: { id: number | null; full_name: string | null }
  }
  creator: { id: number | null; name: string | null }
  previous_reading: string | number
  current_reading: string | number
  consumption: string | number
  price_per_kwh: string | number
  reading_cost: string | number
  reading_date: string
  reading_method: ReadingMethod | null
  status: ReadingStatus | null
  notes: string | null
  created_at: string
}

/** Maps the backend's MeterReadingResource shape into the frontend's `MeterReading` type,
 *  converting decimal-cast string fields into real numbers. */
export function mapMeterReading(raw: MeterReadingApiRecord): MeterReading {
  return {
    id: raw.id,
    created_by: raw.creator?.id ?? null,
    meter_id: raw.meter?.id ?? 0,
    previous_reading: Number(raw.previous_reading ?? 0),
    current_reading: Number(raw.current_reading ?? 0),
    consumption: Number(raw.consumption ?? 0),
    price_per_kwh: Number(raw.price_per_kwh ?? 0),
    reading_cost: Number(raw.reading_cost ?? 0),
    reading_date: raw.reading_date,
    reading_method: raw.reading_method,
    status: raw.status,
    notes: raw.notes,
    created_at: raw.created_at,
    meter: raw.meter
      ? {
          id: raw.meter.id ?? 0,
          meter_number: raw.meter.meter_number ?? '',
          customerName: raw.meter.customer?.full_name ?? null,
        }
      : undefined,
    createdBy: raw.creator?.id
      ? { id: raw.creator.id, name: raw.creator.name ?? '' }
      : undefined,
  }
}

export interface ReadingListParams {
  page?: number
  per_page?: number
  search?: string
  status?: ReadingStatus
  year?: number
  month?: number
  day?: number
}

export async function fetchReadingList(
  params: ReadingListParams = {},
): Promise<LaravelPaginated<MeterReadingApiRecord>> {
  const response = await apiClient.get<ApiResponse<LaravelPaginated<MeterReadingApiRecord>>>(
    '/meter-readings',
    { params },
  )
  return response.data.data
}

export async function fetchReadingById(id: number): Promise<MeterReadingApiRecord> {
  const response = await apiClient.get<ApiResponse<MeterReadingApiRecord>>(`/meter-readings/${id}`)
  return response.data.data
}

export interface ReadingStatsResponse {
  total_readings: number
  total_consumption: number
  expected_revenue: number
  approved_readings: number
  pending_readings: number
  rejected_readings: number
  this_month_consumption: number
  this_month_revenue: number
}

export async function fetchReadingStats(): Promise<ReadingStatsResponse> {
  const response = await apiClient.get<ApiResponse<ReadingStatsResponse>>('/meter-readings/stats')
  return response.data.data
}

export async function createReading(payload: CreateReadingPayload): Promise<MeterReadingApiRecord> {
  const response = await apiClient.post<ApiResponse<MeterReadingApiRecord>>('/meter-readings', payload)
  return response.data.data
}

export async function updateReading(
  id: number,
  payload: UpdateReadingPayload,
): Promise<MeterReadingApiRecord> {
  const response = await apiClient.put<ApiResponse<MeterReadingApiRecord>>(`/meter-readings/${id}`, payload)
  return response.data.data
}

export async function deleteReading(id: number): Promise<void> {
  await apiClient.delete(`/meter-readings/${id}`)
}
