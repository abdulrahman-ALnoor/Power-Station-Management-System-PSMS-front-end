// ============================================================
// Dashboard service — backend route: GET /dashboard
// (DashboardController::index) — one call returns everything
// the admin dashboard page needs in a single payload.
// ============================================================

import apiClient from './api'
import type { ApiResponse } from '@/types/api'

export interface DashboardStatistics {
  users_count: number
  customers_count: number
  meters_count: number
  service_requests_count: number
  monthly_revenue: number
  uncollected_this_month: number
}

export interface ChartSeries {
  labels: string[]
  values: number[]
  total: number
}

export interface ElectricityConsumptionChart extends ChartSeries {
  period: 'daily' | 'weekly' | 'monthly'
  total_consumption: number
  unit: string
}

export interface EquipmentStatusSummary {
  total_equipment: number
  used_equipment: number
  maintenance_equipment: number
  damaged_equipment: number
  lost_equipment: number
}

export interface DashboardLatestReading {
  id: number
  meter_number: string | null
  customer_name: string | null
  reader_name: string | null
  reading: number
  consumption: number
  reading_date: string
  status: string | null
}

export interface DashboardLatestServiceRequest {
  id: number
  request_number: string
  customer_name: string | null
  request_type: string
  priority: string
  status: string
  created_at: string
}

export interface DashboardLatestInvoice {
  id: number
  invoice_number: string
  customer: { id: number | null; name: string | null }
  consumption_charge: {
    id: number | null
    total_amount: number | null
    remaining_amount: number | null
  }
  paid_amount: number
  remaining_balance: number
  status: string
  payment_notes: string | null
  created_at: string
}

export interface DashboardData {
  statistics: DashboardStatistics
  monthly_revenue_chart: ChartSeries
  electricity_consumption_chart: ElectricityConsumptionChart
  equipment_status: EquipmentStatusSummary
  latest_readings: DashboardLatestReading[]
  latest_service_requests: DashboardLatestServiceRequest[]
  latest_invoices: DashboardLatestInvoice[]
}

export async function fetchDashboard(): Promise<DashboardData> {
  const response = await apiClient.get<ApiResponse<DashboardData>>('/dashboard')
  return response.data.data
}
