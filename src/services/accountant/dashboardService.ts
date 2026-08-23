import { mockInvoices } from './invoiceService'
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

class DashboardService {
 async getDashboardStats(): Promise<AccountantDashboardStats> {
 await new Promise(resolve => setTimeout(resolve, 500))

 const totalInvoices = mockInvoices.length
 const paidInvoices = mockInvoices.filter(inv => inv.status === 'paid').length

 const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000)
 const overdueInvoices = mockInvoices.filter(inv => inv.status !== 'paid' && new Date(inv.created_at) < thirtyDaysAgo).length

 const totalDueAmount = mockInvoices.reduce((acc, inv) => acc + inv.outstanding_before_payment, 0)
 const totalCollectedAmount = mockInvoices.reduce((acc, inv) => acc + inv.paid_amount, 0)
 const totalRemainingAmount = mockInvoices.reduce((acc, inv) => acc + inv.remaining_balance, 0)

 return {
 totalInvoices,
 paidInvoices,
 overdueInvoices,
 totalDueAmount,
 totalCollectedAmount,
 totalRemainingAmount,
 }
 }

 async getMonthlyRevenue(): Promise<{ month: string; month_label: string; days: { day: number; revenue: number }[] }> {
 await new Promise(resolve => setTimeout(resolve, 500))

 const today = new Date()
 const daysInMonth = getDaysInMonth(today)

 const days = Array.from({ length: daysInMonth }, (_, i) => ({
 day: i + 1,
 // Random mock revenue between 0 and 5000
 revenue: Math.floor(Math.random() * 5000)
 }))

 return {
 month: format(today, 'yyyy-MM'),
 month_label: format(today, 'MMMM yyyy', { locale: ar }),
 days
 }
 }

 async getLatestCollections(): Promise<Invoice[]> {
 await new Promise(resolve => setTimeout(resolve, 500))
 // Return the latest invoices that have some paid amount
 const collections = mockInvoices
 .filter(inv => inv.paid_amount > 0)
 .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
 .slice(0, 5)

 return collections
 }
}

export const dashboardService = new DashboardService()
