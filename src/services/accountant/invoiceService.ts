import { Invoice, GetInvoicesParams, PaginatedResponse } from '@/pages/accountant/invoices/types'
import { mockCustomers, mockMeters } from '@/pages/engineer/service-requests/data/mockData'

// Mock Data for Invoices
export const mockInvoices: Invoice[] = [
 {
 id: 1,
 invoice_number: 'INV-2023-001',
 customer_id: 1,
 accountant_id: 3,
 consumption_charge_id: 101,
 outstanding_before_payment: 1500.00,
 paid_amount: 1500.00,
 remaining_balance: 0.00,
 status: 'paid',
 payment_notes: 'Paid in full via bank transfer',
 pdf_path: null,
 created_at: new Date(Date.now() - 5 * 86400000).toISOString(), // 5 days ago
 updated_at: new Date(Date.now() - 4 * 86400000).toISOString(),
 customer: mockCustomers.find(c => c.id === 1),
 meter: mockMeters.find(m => m.id === 1),
 accountant: { id: 3, name: 'Accountant User' },
 },
 {
 id: 2,
 invoice_number: 'INV-2023-002',
 customer_id: 2,
 accountant_id: 3,
 consumption_charge_id: 102,
 outstanding_before_payment: 3200.00,
 paid_amount: 1000.00,
 remaining_balance: 2200.00,
 status: 'partially_paid',
 payment_notes: 'First installment received',
 pdf_path: null,
 created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
 updated_at: new Date(Date.now() - 10 * 86400000).toISOString(),
 customer: mockCustomers.find(c => c.id === 2),
 meter: mockMeters.find(m => m.id === 2),
 accountant: { id: 3, name: 'Accountant User' },
 },
 {
 id: 3,
 invoice_number: 'INV-2023-003',
 customer_id: 1,
 accountant_id: 3,
 consumption_charge_id: 103,
 outstanding_before_payment: 850.00,
 paid_amount: 0.00,
 remaining_balance: 850.00,
 status: null,
 payment_notes: null,
 pdf_path: null,
 created_at: new Date(Date.now() - 35 * 86400000).toISOString(), // Overdue
 updated_at: new Date(Date.now() - 35 * 86400000).toISOString(),
 customer: mockCustomers.find(c => c.id === 1),
 meter: mockMeters.find(m => m.id === 1),
 accountant: { id: 3, name: 'Accountant User' },
 }
]

class InvoiceService {
 /**
 * Mock API call to get paginated invoices with filtering.
 */
 async getInvoices(params: GetInvoicesParams): Promise<PaginatedResponse<Invoice>> {
 await new Promise(resolve => setTimeout(resolve, 600)) // network delay

 let filtered = [...mockInvoices]

 if (params.search) {
 const q = params.search.toLowerCase()
 filtered = filtered.filter(inv =>
 inv.invoice_number.toLowerCase().includes(q) ||
 inv.customer?.full_name.toLowerCase().includes(q) ||
 inv.meter?.meter_number.toLowerCase().includes(q)
 )
 }

 if (params.status && params.status !== 'all') {
 if (params.status === 'overdue') {
 // Mock logic for overdue: status is null (unpaid) and created > 30 days ago
 const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000)
 filtered = filtered.filter(inv => inv.status !== 'paid' && new Date(inv.created_at) < thirtyDaysAgo)
 } else if (params.status === 'unpaid') {
 filtered = filtered.filter(inv => inv.status === null)
 } else {
 filtered = filtered.filter(inv => inv.status === params.status)
 }
 }

 if (params.date_from) {
 const fromDate = new Date(params.date_from)
 filtered = filtered.filter(inv => new Date(inv.created_at) >= fromDate)
 }

 if (params.date_to) {
 const toDate = new Date(params.date_to)
 // Include the end of the day
 toDate.setHours(23, 59, 59, 999)
 filtered = filtered.filter(inv => new Date(inv.created_at) <= toDate)
 }

 // Pagination
 const page = params.page || 1
 const perPage = params.per_page || 10
 const start = (page - 1) * perPage
 const paginatedItems = filtered.slice(start, start + perPage)

 return {
 data: paginatedItems,
 current_page: page,
 last_page: Math.ceil(filtered.length / perPage) || 1,
 per_page: perPage,
 total: filtered.length,
 from: start + 1,
 to: start + paginatedItems.length,
 }
 }

 async getInvoice(id: number): Promise<Invoice> {
 await new Promise(resolve => setTimeout(resolve, 300))
 const inv = mockInvoices.find(i => i.id === id)
 if (!inv) throw new Error('Invoice not found')
 return inv
 }

 async createInvoice(data: Partial<Invoice>): Promise<Invoice> {
 await new Promise(resolve => setTimeout(resolve, 800))
 const newId = Math.max(...mockInvoices.map(i => i.id)) + 1

 // Server calculates remaining balance
 const outstanding = data.outstanding_before_payment || 0
 const paid = data.paid_amount || 0
 const remaining = Math.max(0, outstanding - paid)

 let status: 'paid' | 'partially_paid' | null = null
 if (paid >= outstanding && outstanding > 0) status = 'paid'
 else if (paid > 0) status = 'partially_paid'

 const newInvoice: Invoice = {
 id: newId,
 invoice_number: `INV-${new Date().getFullYear()}-${String(newId).padStart(3, '0')}`,
 customer_id: data.customer_id || 1,
 accountant_id: 3, // Mock authenticated user
 consumption_charge_id: data.consumption_charge_id || 0,
 outstanding_before_payment: outstanding,
 paid_amount: paid,
 remaining_balance: remaining,
 status: status,
 payment_notes: data.payment_notes || null,
 pdf_path: null,
 created_at: new Date().toISOString(),
 updated_at: new Date().toISOString(),
 customer: mockCustomers.find(c => c.id === data.customer_id) || mockCustomers[0],
 meter: mockMeters[0], // Mock association
 }

 mockInvoices.unshift(newInvoice)
 return newInvoice
 }

 async updateInvoice(id: number, data: Partial<Invoice>): Promise<Invoice> {
 await new Promise(resolve => setTimeout(resolve, 800))
 const index = mockInvoices.findIndex(inv => inv.id === id)
 if (index === -1) throw new Error('Invoice not found')

 const existing = mockInvoices[index]
 const outstanding = data.outstanding_before_payment !== undefined ? data.outstanding_before_payment : existing.outstanding_before_payment
 const paid = data.paid_amount !== undefined ? data.paid_amount : existing.paid_amount
 const remaining = Math.max(0, outstanding - paid)

 let status: 'paid' | 'partially_paid' | null = null
 if (paid >= outstanding && outstanding > 0) status = 'paid'
 else if (paid > 0) status = 'partially_paid'

 const updated = {
 ...existing,
 ...data,
 id: existing.id, // Ensure immutable IDs
 invoice_number: existing.invoice_number,
 accountant_id: existing.accountant_id,
 outstanding_before_payment: outstanding,
 paid_amount: paid,
 remaining_balance: remaining,
 status: status,
 updated_at: new Date().toISOString(),
 customer: data.customer_id ? mockCustomers.find(c => c.id === data.customer_id) || existing.customer : existing.customer
 }

 mockInvoices[index] = updated
 return updated
 }

 /**
 * Mock API call to delete an invoice.
 */
 async deleteInvoice(id: number): Promise<void> {
 await new Promise(resolve => setTimeout(resolve, 800))
 const index = mockInvoices.findIndex(inv => inv.id === id)
 if (index === -1) {
 throw new Error('Invoice not found')
 }
 mockInvoices.splice(index, 1)
 }
}

export const invoiceService = new InvoiceService()
