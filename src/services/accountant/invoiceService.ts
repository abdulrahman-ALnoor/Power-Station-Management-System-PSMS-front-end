import apiClient from '../api'
import type { ApiResponse } from '@/types/api'
import type { Invoice, GetInvoicesParams, PaginatedResponse } from '@/pages/accountant/invoices/types'

interface LaravelInvoiceResource {
  id: number
  invoice_number: string
  customer?: { id: number | null; name: string | null; full_name?: string | null }
  consumption_charge?: {
    id: number | null
    total_amount: number | string | null
    remaining_amount: number | string | null
  }
  paid_amount: number | string
  remaining_balance: number | string
  status: string
  payment_notes: string | null
  created_at: string
  updated_at?: string
}

interface LaravelPaginatedData<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface ConsumptionChargeOption {
  id: number
  customer_id?: number
  total_amount?: number | string
  remaining_amount?: number | string
  status?: string
  meter_number?: string
  customer_name?: string
}

export interface CustomerOption {
  id: number
  name: string;
}

class InvoiceService {
  /**
   * Fetch paginated invoices from Laravel API with backend search/filters.
   */
  async getInvoices(params: GetInvoicesParams): Promise<PaginatedResponse<Invoice>> {
    const queryParams: Record<string, any> = {
      page: params.page || 1,
      per_page: params.per_page || 10,
    }

    if (params.search) queryParams.search = params.search
    if (params.status && params.status !== 'all') queryParams.status = params.status
    if (params.date_from) queryParams.date_from = params.date_from
    if (params.date_to) queryParams.date_to = params.date_to

    const response = await apiClient.get<ApiResponse<LaravelPaginatedData<LaravelInvoiceResource> | LaravelInvoiceResource[]>>('/invoices', {
      params: queryParams
    })

    const responseData = response.data.data

    let rawList: LaravelInvoiceResource[] = []
    let currentPage = 1
    let lastPage = 1
    let perPage = params.per_page || 10
    let total = 0

    if (Array.isArray(responseData)) {
      rawList = responseData
      total = rawList.length
    } else if (responseData && Array.isArray(responseData.data)) {
      rawList = responseData.data
      currentPage = responseData.current_page || 1
      lastPage = responseData.last_page || 1
      perPage = responseData.per_page || 10
      total = responseData.total || rawList.length
    }

    const mappedInvoices: Invoice[] = rawList.map(inv => {
      const paid = Number(inv.paid_amount) || 0
      const remaining = Number(inv.remaining_balance) || 0
      const totalCharge = inv.consumption_charge?.total_amount ? Number(inv.consumption_charge.total_amount) : (paid + remaining)

      return {
        id: inv.id,
        invoice_number: inv.invoice_number,
        customer_id: inv.customer?.id ?? 0,
        accountant_id: 1,
        consumption_charge_id: inv.consumption_charge?.id ?? 0,
        outstanding_before_payment: totalCharge,
        paid_amount: paid,
        remaining_balance: remaining,
        status: (inv.status as any) || null,
        payment_notes: inv.payment_notes || null,
        pdf_path: null,
        created_at: inv.created_at,
        updated_at: inv.updated_at || inv.created_at,
        customer: inv.customer ? {
          id: inv.customer.id || 0,
          full_name: inv.customer.name || inv.customer.full_name || 'عميل'
        } : undefined
      }
    })

    return {
      data: mappedInvoices,
      current_page: currentPage,
      last_page: lastPage,
      per_page: perPage,
      total,
      from: (currentPage - 1) * perPage + 1,
      to: Math.min(currentPage * perPage, total)
    }
  }

  async getInvoice(id: number): Promise<Invoice> {
    const response = await apiClient.get<ApiResponse<LaravelInvoiceResource>>(`/invoices/${id}`)
    const inv = response.data.data

    const paid = Number(inv.paid_amount) || 0
    const remaining = Number(inv.remaining_balance) || 0

    return {
      id: inv.id,
      invoice_number: inv.invoice_number,
      customer_id: inv.customer?.id ?? 0,
      accountant_id: 1,
      consumption_charge_id: inv.consumption_charge?.id ?? 0,
      outstanding_before_payment: paid + remaining,
      paid_amount: paid,
      remaining_balance: remaining,
      status: (inv.status as any) || null,
      payment_notes: inv.payment_notes || null,
      pdf_path: null,
      created_at: inv.created_at,
      updated_at: inv.updated_at || inv.created_at,
      customer: inv.customer ? {
        id: inv.customer.id || 0,
        full_name: inv.customer.name || inv.customer.full_name || 'عميل'
      } : undefined
    }
  }

  async createInvoice(data: Partial<Invoice>): Promise<Invoice> {
    const payload = {
      consumption_charge_id: data.consumption_charge_id,
      paid_amount: data.paid_amount,
      payment_notes: data.payment_notes || undefined,
    }

    const response = await apiClient.post<ApiResponse<LaravelInvoiceResource>>('/invoices', payload)
    const inv = response.data.data

    return {
      id: inv.id,
      invoice_number: inv.invoice_number,
      customer_id: inv.customer?.id ?? 0,
      accountant_id: 1,
      consumption_charge_id: inv.consumption_charge?.id ?? 0,
      outstanding_before_payment: Number(inv.paid_amount) + Number(inv.remaining_balance),
      paid_amount: Number(inv.paid_amount) || 0,
      remaining_balance: Number(inv.remaining_balance) || 0,
      status: (inv.status as any) || null,
      payment_notes: inv.payment_notes || null,
      pdf_path: null,
      created_at: inv.created_at,
      updated_at: inv.created_at,
      customer: inv.customer ? { id: inv.customer.id || 0, full_name: inv.customer.name || '' } : undefined,
    }
  }

  async updateInvoice(id: number, data: Partial<Invoice>): Promise<Invoice> {
    const payload: Record<string, any> = {}
    if (data.paid_amount !== undefined) payload.paid_amount = data.paid_amount
    if (data.payment_notes !== undefined) payload.payment_notes = data.payment_notes
    if (data.status !== undefined) payload.status = data.status

    const response = await apiClient.put<ApiResponse<LaravelInvoiceResource>>(`/invoices/${id}`, payload)
    const inv = response.data.data

    return {
      id: inv.id,
      invoice_number: inv.invoice_number,
      customer_id: inv.customer?.id ?? 0,
      accountant_id: 1,
      consumption_charge_id: inv.consumption_charge?.id ?? 0,
      outstanding_before_payment: Number(inv.paid_amount) + Number(inv.remaining_balance),
      paid_amount: Number(inv.paid_amount) || 0,
      remaining_balance: Number(inv.remaining_balance) || 0,
      status: (inv.status as any) || null,
      payment_notes: inv.payment_notes || null,
      pdf_path: null,
      created_at: inv.created_at,
      updated_at: inv.created_at,
    }
  }

  async deleteInvoice(id: number): Promise<void> {
    await apiClient.delete(`/invoices/${id}`)
  }

  /**
   * Get active consumption charges for creation dropdown.
   */
  async getConsumptionCharges(): Promise<ConsumptionChargeOption[]> {
    try {
      const response = await apiClient.get<ApiResponse<any[]>>('/consumption-charges')
      const raw = response.data.data || []
      return raw.map(item => ({
        id: item.id,
        customer_id: item.customer_id || item.customer?.id,
        total_amount: item.total_amount,
        remaining_amount: item.remaining_amount,
        status: item.status,
        meter_number: item.meter?.meter_number ? `عداد: ${item.meter.meter_number} (متبقي ${item.remaining_amount} ر.س)` : `دين #${item.id} (متبقي ${item.remaining_amount} ر.س)`,
        customer_name: item.customer?.full_name || item.customer?.name || ''
      }))
    } catch {
      return []
    }
  }

  /**
   * Get customers for dropdown.
   */
  async getCustomers(): Promise<CustomerOption[]> {
    try {
      const response = await apiClient.get<ApiResponse<any[]>>('/customers')
      const raw = response.data.data || []
      return raw.map(c => ({
        id: c.id,
        name: c.full_name || c.name || `عميل #${c.id}`
      }))
    } catch {
      return []
    }
  }
}

export const invoiceService = new InvoiceService()
