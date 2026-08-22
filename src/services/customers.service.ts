// ============================================================
// Customers service — backend routes (routes/api.php + CustomerController)
// ============================================================
import apiClient from './api'
import type { ApiResponse } from '@/types/api'

export type CustomerType = 'residential' | 'commercial' | 'industrial'

export interface CustomerApiRecord {
  id: number
  customer_number: string | null
  full_name: string
  customer_type: CustomerType | null
  phone: string | null
  alternative_phone: string | null
  address_description: string | null
  notes: string | null
  created_by: number | null
  creator?: { id: number; name: string } | null
  created_at: string | null
}

export interface CustomerPayload {
  customer_number?: string
  full_name: string
  customer_type: CustomerType
  phone: string
  alternative_phone?: string
  address_description?: string
  notes?: string
}

export async function fetchCustomers(): Promise<CustomerApiRecord[]> {
  const response = await apiClient.get<ApiResponse<CustomerApiRecord[]>>('/customers')
  return response.data.data
}

export async function createCustomer(payload: CustomerPayload): Promise<CustomerApiRecord> {
  const response = await apiClient.post<ApiResponse<CustomerApiRecord>>('/customers', payload)
  return response.data.data
}

export async function updateCustomer(
  id: number,
  payload: Partial<CustomerPayload>,
): Promise<CustomerApiRecord> {
  const response = await apiClient.put<ApiResponse<CustomerApiRecord>>(`/customers/${id}`, payload)
  return response.data.data
}

export async function deleteCustomer(id: number): Promise<void> {
  await apiClient.delete(`/customers/${id}`)
}
