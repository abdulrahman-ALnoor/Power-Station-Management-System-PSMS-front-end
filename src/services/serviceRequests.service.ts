import apiClient from './api'
import type { ApiResponse } from '@/types/api'

export type ServiceRequestType =
  | 'new_connection'
  | 'maintenance'
  | 'disconnection'

export type ServiceRequestPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'emergency'

export type ServiceRequestStatus =
  | 'pending'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

export interface ServiceRequestApiRecord {
  id: number

  meter: {
    id: number
    meter_number: string
  } | null

  customer: {
    id: number
    full_name: string
  } | null

  creator: {
    id: number
    name: string
  } | null

  assigned_engineer: {
    id: number
    name: string
  } | null

  request_type: ServiceRequestType
  priority: ServiceRequestPriority | null
  status: ServiceRequestStatus
  description: string | null
  completed_at: string | null
  created_at: string | null
  updated_at?: string | null
}

export interface CreateServiceRequestPayload {
  meter_id: number
  customer_id: number
  request_type: ServiceRequestType
  priority?: ServiceRequestPriority
  description?: string
}

export async function createServiceRequest(
  payload: CreateServiceRequestPayload,
): Promise<ServiceRequestApiRecord> {
  const response = await apiClient.post<ApiResponse<ServiceRequestApiRecord>>(
    '/service-requests',
    payload,
  )

  return response.data.data
}