import apiClient from './api'
import type { ApiResponse } from '@/types/api'

export interface ConsumptionChargeRecord {
  id: number
  customer: { id: number | null; full_name: string | null } | null
  meter: { id: number | null; meter_number: string | null } | null
  total_amount: number | string
  paid_amount: number | string
  remaining_amount: number | string
  status: string
}

export interface InvoiceApiRecord {
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

export interface CreateInvoicePayload {
  consumption_charge_id: number
  paid_amount: number
  payment_notes?: string
}

export interface InvoiceListResponse {
  data: InvoiceApiRecord[]
  current_page: number
  last_page: number
  total: number
}

export interface InvoiceStatsResponse {
  total_revenue: number
  total_invoices: number
  paid_invoices_count: number
  partially_paid_count: number
  overdue_amount: number
  this_month_collect: number
}

export async function fetchInvoices(params?: {
  page?: number
  per_page?: number
  search?: string
  status?: string
}): Promise<InvoiceListResponse> {
  const response = await apiClient.get<ApiResponse<unknown>>('/invoices', {
    params,
  })

  const raw = response.data.data as
    | InvoiceListResponse
    | InvoiceApiRecord[]
    | { data?: InvoiceApiRecord[]; current_page?: number; last_page?: number; total?: number }
    | undefined

  if (Array.isArray(raw)) {
    return {
      data: raw,
      current_page: 1,
      last_page: 1,
      total: raw.length,
    }
  }

  const paginated = raw ?? {}
  return {
    data: Array.isArray(paginated.data) ? paginated.data : [],
    current_page: paginated.current_page ?? 1,
    last_page: paginated.last_page ?? 1,
    total: paginated.total ?? (Array.isArray(paginated.data) ? paginated.data.length : 0),
  }
}

export async function fetchInvoiceStats(): Promise<InvoiceStatsResponse> {
  const response = await apiClient.get<ApiResponse<InvoiceStatsResponse>>('/invoices/stats')
  return response.data.data
}

export interface CustomerOption {
  id: number
  full_name: string
  customer_number?: string
}

export interface MeterOption {
  id: number
  meter_number: string
  installation_location?: string
  status?: string
}

export async function fetchCustomersDropdown(): Promise<CustomerOption[]> {
  const response = await apiClient.get<ApiResponse<any>>('/customers', {
    params: { per_page: 100 },
  })
  const raw = response.data?.data
  const items = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : []
  return items.map((c: any) => ({
    id: c.id,
    full_name: c.full_name || c.name || `عميل #${c.id}`,
    customer_number: c.customer_number,
  }))
}

export async function fetchCustomerMeters(customerId: number): Promise<MeterOption[]> {
  const response = await apiClient.get<ApiResponse<any>>('/meters', {
    params: { customer_id: customerId, per_page: 100 },
  })
  const raw = response.data?.data
  const items = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : []
  return items.map((m: any) => ({
    id: m.id,
    meter_number: m.meter_number,
    installation_location: m.installation_location,
    status: m.status,
  }))
}

export async function fetchMeterConsumptionCharges(
  customerId: number,
  meterId: number,
): Promise<ConsumptionChargeRecord[]> {
  const response = await apiClient.get<ApiResponse<ConsumptionChargeRecord[]>>(
    '/consumption-charges',
    {
      params: {
        customer_id: customerId,
        meter_id: meterId,
        status: 'unpaid',
      },
    },
  )
  return response.data.data || []
}

export async function fetchConsumptionCharges(): Promise<ConsumptionChargeRecord[]> {
  const response = await apiClient.get<ApiResponse<ConsumptionChargeRecord[]>>(
    '/consumption-charges',
  )
  return response.data.data
}

export async function createInvoice(
  payload: CreateInvoicePayload,
): Promise<InvoiceApiRecord> {
  const response = await apiClient.post<ApiResponse<InvoiceApiRecord>>(
    '/invoices',
    payload,
  )
  return response.data.data
}

export interface UpdateInvoicePayload {
  outstanding_before_payment?: number
  paid_amount?: number
  remaining_balance?: number
  status?: 'paid' | 'partially_paid'
  payment_notes?: string
}

export async function updateInvoice(
  id: number,
  payload: UpdateInvoicePayload,
): Promise<InvoiceApiRecord> {
  const response = await apiClient.put<ApiResponse<InvoiceApiRecord>>(
    `/invoices/${id}`,
    payload,
  )
  return response.data.data
}

export async function deleteInvoice(id: number): Promise<void> {
  await apiClient.delete(`/invoices/${id}`)
}

export interface InvoicePdfExportResult {
  pdf_url: string
  invoice_number?: string
  invoice_id?: number
}

export async function downloadInvoicePdf(
  invoiceId: number,
): Promise<InvoicePdfExportResult> {
  const response = await apiClient.get<ApiResponse<InvoicePdfExportResult>>(
    `/invoices/${invoiceId}/pdf`,
  )

  return response.data.data
}
export interface MonthlyRevenueItem {
  month: number
  invoices_amount: number | string
  collections_amount: number | string
}

export async function fetchMonthlyRevenue(): Promise<
  MonthlyRevenueItem[]
> {
  const response = await apiClient.get(
    '/invoices/monthly-revenue',
  )

  return response.data.data
}

export interface StatusDistributionItem {
  name: string
  value: number | string
}

export async function fetchStatusDistribution(): Promise<
  StatusDistributionItem[]
> {
  const response = await apiClient.get(
    '/invoices/status-distribution',
  )

  return response.data.data
}


export interface RevenueReport {
  total_invoices: number
  total_collected: number
  total_remaining: number
  total_invoices_count: number
}

export async function fetchRevenueReport(): Promise<
  RevenueReport
> {
  const response = await apiClient.get(
    '/reports/revenue',
  )

  return response.data.data
}


// ============================================================
// الفواتير المتأخرة
// ============================================================
export interface OverdueInvoice {
  id: number
  invoice_number: string

  customer: {
    id: number | null
    full_name: string | null
  } | null

  consumption_charge: {
    id: number | null
    total_amount: number | string | null
    remaining_amount: number | string | null
  } | null

  paid_amount: number | string
  remaining_balance: number | string
  status: string
  created_at: string
}

export interface OverdueInvoicesResponse {
  data: OverdueInvoice[]
  current_page: number
  last_page: number
  total: number
}

export async function fetchOverdueInvoices(
  params?: {
    page?: number
    per_page?: number
    search?: string
  },
): Promise<OverdueInvoicesResponse> {
  const response = await apiClient.get<
    ApiResponse<OverdueInvoicesResponse>
  >('/invoices/overdue', {
    params,
  })

  return response.data.data
}


// ============================================================
// Collections Report
// ============================================================

export interface CollectionRecord {
  id: number

  invoice_number: string

 customer: {
  id: number | null
  full_name: string | null
} | null

  paid_amount: number | string

  remaining_balance: number | string

  status: string

  created_at: string
}

export interface CollectionsReportStats {
  total_collected: number | string

  collections_count: number

  fully_paid_count: number

  partially_paid_count: number
}

export interface CollectionsReportResponse {
  collections: {
    data: CollectionRecord[]

    current_page: number

    last_page: number

    total: number
  }

  stats: CollectionsReportStats
}

export async function fetchCollectionsReport(
  params?: {
    page?: number
    per_page?: number
    search?: string
  },
): Promise<CollectionsReportResponse> {
  const response = await apiClient.get<
    ApiResponse<CollectionsReportResponse>
  >(
    '/reports/collections',
    {
      params,
    },
  )

  return response.data.data
}


// ============================================================
// Account Statement
// ============================================================

export interface AccountStatementInvoice {
  id: number

  invoice_number: string

  customer: {
    id: number | null
    name: string | null
  } | null

  consumption_charge: {
    id: number | null
    total_amount: number | string | null
  } | null

  paid_amount: number | string

  remaining_balance: number | string

  status: string

  created_at: string
}

export interface AccountStatementCustomer {
  id: number

  name: string | null
}

export interface AccountStatementSummary {
  total_invoices: number | string

  total_paid: number | string

  total_remaining: number | string
}

export interface AccountStatementResponse {
  customer: AccountStatementCustomer

  invoices: {
    data: AccountStatementInvoice[]

    current_page: number

    last_page: number

    total: number
  }

  summary: AccountStatementSummary
}
export async function fetchAccountStatement(
  customerId: number,
  params?: {
    page?: number
    per_page?: number
  },
): Promise<AccountStatementResponse> {
  const response = await apiClient.get<
    ApiResponse<AccountStatementResponse>
  >(
    '/reports/account-statement',
    {
      params: {
        customer_id: customerId,
        ...params,
      },
    },
  )

  console.log(
    'Account Statement Response:',
    response.data,
  )

  return response.data.data
}









