import apiClient from './api'
import type { ApiResponse, LaravelPaginated } from '@/types/api'

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
  meters_count?: number
  created_at: string | null
}

export interface CustomerStatsData {
  total_customers: number
  residential_count: number
  commercial_count: number
  industrial_count: number
}

export interface CustomerDetailsData {
  customer_info: CustomerApiRecord
  statistics: {
    meters_count: number
    total_consumption: number
    outstanding_balance: number
  }
  meters: any[]
  financial_summary: {
    last_payment_amount: number
    last_payment_date: string | null
  }
  latest_service_requests: any[]
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

export interface GetCustomersParams {
  page?: number
  per_page?: number
  search?: string
  customer_type?: string
}

export async function fetchCustomers(): Promise<CustomerApiRecord[]> {
  const response = await apiClient.get<ApiResponse<CustomerApiRecord[]>>('/customers')
  const data = response.data.data
  if (Array.isArray(data)) return data
  if ((data as any)?.data && Array.isArray((data as any).data)) return (data as any).data
  return []
}

export async function fetchCustomersPaginated(
  params: GetCustomersParams,
): Promise<LaravelPaginated<CustomerApiRecord>> {
  const response = await apiClient.get<ApiResponse<LaravelPaginated<CustomerApiRecord>>>('/customers', {
    params,
  })
  const res = response.data.data
  if (res && Array.isArray(res.data)) return res
  // Fallback wrapper if flat array returned
  const arrayData = Array.isArray(res) ? res : []
  return {
    current_page: 1,
    data: arrayData as any,
    first_page_url: '',
    from: 1,
    last_page: 1,
    last_page_url: '',
    links: [],
    next_page_url: null,
    path: '',
    per_page: arrayData.length || 10,
    prev_page_url: null,
    to: arrayData.length,
    total: arrayData.length,
  }
}

export async function fetchCustomerStats(): Promise<CustomerStatsData> {
  try {
    const response = await apiClient.get<ApiResponse<CustomerStatsData>>('/customers/stats')
    return response.data.data || {
      total_customers: 0,
      residential_count: 0,
      commercial_count: 0,
      industrial_count: 0,
    }
  } catch {
    return {
      total_customers: 0,
      residential_count: 0,
      commercial_count: 0,
      industrial_count: 0,
    }
  }
}

export async function fetchCustomerDetails(id: number): Promise<CustomerDetailsData | null> {
  try {
    const response = await apiClient.get<ApiResponse<CustomerDetailsData>>(`/customers/${id}/details`)
    return response.data.data
  } catch {
    return null
  }
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
