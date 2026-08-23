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
 created_at: string
 updated_at: string
 
 // Optional relationships
 customer?: {
 id: number
 name: string
 }
 accountant?: {
 id: number
 name: string
 }
 consumptionCharge?: {
 id: number
 meter?: {
 id: number
 meter_number: string
 }
 }
}
