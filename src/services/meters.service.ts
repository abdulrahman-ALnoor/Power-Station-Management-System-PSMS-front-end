import apiClient from './api'
import type { ApiResponse, LaravelPaginated } from '@/types/api'
import type {
  Meter,
  MeterStatus,
  CreateMeterPayload,
  UpdateMeterPayload,
} from '@/pages/admin/meters/types'

export interface MeterApiRecord {
  id: number
  customer: { id: number | null; full_name: string | null }
  meter_number: string
  qr_code: string | null
  qr_code_url: string | null
  installation_date: string | null
  installation_location: string | null
  status: MeterStatus | null
  readings_count?: number
  installer: { id: number | null; name: string | null }
  creator: { id: number | null; name: string | null }
  created_at: string
  updated_at: string
}

export function mapMeter(raw: MeterApiRecord): Meter {
  return {
    id: raw.id,
    meter_number: raw.meter_number,
    qr_code: raw.qr_code,
    qr_code_url: raw.qr_code_url,
    installation_date: raw.installation_date,
    installation_location: raw.installation_location,
    status: raw.status,

    customer_id: raw.customer?.id ?? null,
    customerName: raw.customer?.full_name ?? null,

    installed_by: raw.installer?.id ?? null,
    installedByName: raw.installer?.name ?? null,

    created_by: raw.creator?.id ?? null,
    createdByName: raw.creator?.name ?? null,

    created_at: raw.created_at,
    updated_at: raw.updated_at,
  }
}

export interface MeterListParams {
  page?: number
  search?: string
  location?: string
  date_from?: string
  date_to?: string
  status?: MeterStatus
}

export interface MeterLastReadingResponse {
  meter_id: number
  meter_number: string
  customer_name: string
  previous_reading: number
  last_reading_date: string | null
}

export async function fetchMeterList(
  params: MeterListParams = {},
): Promise<LaravelPaginated<MeterApiRecord>> {
  const response = await apiClient.get<ApiResponse<LaravelPaginated<MeterApiRecord>>>(
    '/meters',
    { params },
  )
  return response.data.data
}

export async function fetchMeterById(id: number): Promise<MeterApiRecord> {
  const response = await apiClient.get<ApiResponse<MeterApiRecord>>(`/meters/${id}`)
  return response.data.data
}

export async function fetchMeterLastReading(id: number): Promise<MeterLastReadingResponse> {
  const response = await apiClient.get<ApiResponse<MeterLastReadingResponse>>(`/meters/${id}/last-reading`)
  return response.data.data
}

export interface MeterStatsResponse {
  total_meters: number
  active: number
  disconnected: number
  maintenance: number
  damaged: number
}

export async function fetchMeterStats(): Promise<MeterStatsResponse> {
  const response = await apiClient.get<ApiResponse<MeterStatsResponse>>('/meters/stats')
  return response.data.data
}

export async function createMeter(payload: CreateMeterPayload): Promise<MeterApiRecord> {
  const response = await apiClient.post<ApiResponse<MeterApiRecord>>('/meters', payload)
  return response.data.data
}

export async function updateMeter(
  id: number,
  payload: UpdateMeterPayload,
): Promise<MeterApiRecord> {
  const response = await apiClient.put<ApiResponse<MeterApiRecord>>(`/meters/${id}`, payload)
  return response.data.data
}

export async function deleteMeter(id: number): Promise<void> {
  await apiClient.delete(`/meters/${id}`)
}