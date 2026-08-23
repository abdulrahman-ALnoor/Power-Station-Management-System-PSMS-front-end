// ============================================================
// Types for Invoices Module
// ============================================================

export type InvoiceStatus = 'paid' | 'partially_paid'

export interface Invoice {
 id: number
 invoice_number: string
 customer_id: number
 accountant_id: number
 consumption_charge_id: number
 outstanding_before_payment: number
 paid_amount: number
 remaining_balance: number
 status: InvoiceStatus | null
 payment_notes: string | null
 pdf_path: string | null
 created_at: string
 updated_at: string
 deleted_at?: string | null

 // Relationships (Optional for frontend display)
 customer?: {
 id: number
 full_name: string
 }
 meter?: {
 id: number
 meter_number: string
 }
 accountant?: {
 id: number
 name: string
 }
}

export interface GetInvoicesParams {
 page?: number
 per_page?: number
 search?: string
 status?: string
 date_from?: string
 date_to?: string
}

// Reuse PaginatedResponse from shared types if needed,
// but redefining here or importing from shared is fine.
import { PaginatedResponse } from '@/pages/shared/service-requests/types'
export type { PaginatedResponse }
