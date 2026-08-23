import apiClient from '../api'
import type { ApiResponse } from '@/types/api'
import type { Invoice } from '@/pages/accountant/invoices/types'
import { getDaysInMonth, format } from 'date-fns'
import { ar } from 'date-fns/locale'

export interface AccountantDashboardStats {
  totalInvoices: number
  paidInvoices: number
  overdueInvoices: number
  totalDueAmount: number
  totalCollectedAmount: number
  totalRemainingAmount: number
}

export interface MonthlyRevenue {
  month: string
  revenue: number
}

interface LaravelStatsResponse {
  total_revenue: number
  total_invoices: number
  paid_invoices_count: number
  partially_paid_count: number
  overdue_amount: number
  this_month_collect: number
}

interface LaravelMonthlyRevenueItem {
  month: number
  total_revenue: number | string
}

interface LaravelInvoiceResource {
  id: number
  invoice_number: string
  customer?: { id: number | null; name: string | null }
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
}

class DashboardService {
  async getDashboardStats(): Promise<AccountantDashboardStats> {
    const response = await apiClient.get<ApiResponse<LaravelStatsResponse>>('/invoices/stats')
    const raw = response.data.data

    const totalCollected = Number(raw.total_revenue) || 0
    const overdue = Number(raw.overdue_amount) || 0

    return {
      totalInvoices: Number(raw.total_invoices) || 0,
      paidInvoices: Number(raw.paid_invoices_count) || 0,
      overdueInvoices: Number(raw.partially_paid_count) || 0,
      totalDueAmount: totalCollected + overdue,
      totalCollectedAmount: totalCollected,
      totalRemainingAmount: overdue,
    }
  }

  async getMonthlyRevenue(): Promise<{ month: string; month_label: string; days: { day: number; revenue: number }[] }> {
    const today = new Date()
    const daysInMonth = getDaysInMonth(today)

    let monthlyData: LaravelMonthlyRevenueItem[] = []
    try {
      const response = await apiClient.get<ApiResponse<LaravelMonthlyRevenueItem[]>>('/invoices/monthly-revenue')
      monthlyData = response.data.data || []
    } catch {
      monthlyData = []
    }

    const currentMonthNum = today.getMonth() + 1
    const currentMonthData = monthlyData.find(item => Number(item.month) === currentMonthNum)
    const monthTotalRevenue = currentMonthData ? Number(currentMonthData.total_revenue) || 0 : 0

    // Distribute monthly revenue evenly across days for daily breakdown visualization
    const dailyAvg = Math.round(monthTotalRevenue / daysInMonth)
    const days = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      revenue: dailyAvg
    }))

    return {
      month: format(today, 'yyyy-MM'),
      month_label: format(today, 'MMMM yyyy', { locale: ar }),
      days
    }
  }

  async getLatestCollections(): Promise<Invoice[]> {
    const response = await apiClient.get<ApiResponse<LaravelInvoiceResource[]>>('/invoices/latest-payments')
    const rawList = response.data.data || []

    return rawList.map(inv => {
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
        status: inv.status as any,
        payment_notes: inv.payment_notes || null,
        pdf_path: null,
        created_at: inv.created_at,
        updated_at: inv.created_at,
        customer: inv.customer ? { id: inv.customer.id || 0, full_name: inv.customer.name || '' } : undefined,
      }
    })
  }
}

export const dashboardService = new DashboardService()
