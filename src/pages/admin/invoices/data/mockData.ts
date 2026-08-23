import { Invoice } from '../types'

export const MOCK_INVOICES: Invoice[] = [
 {
 id: 1,
 invoice_number: 'INV-2026-0001',
 customer_id: 101,
 accountant_id: 2,
 consumption_charge_id: 8,
 outstanding_before_payment: 1500.00,
 paid_amount: 1500.00,
 remaining_balance: 0.00,
 status: 'paid',
 payment_notes: 'تم السداد بالكامل',
 created_at: '2026-01-10T10:00:00Z',
 updated_at: '2026-01-10T10:00:00Z',
 customer: { id: 101, name: 'شركة الأفق للتجارة' },
 accountant: { id: 2, name: 'سارة محمد' },
 consumptionCharge: { id: 8, meter: { id: 201, meter_number: 'MT-8842' } }
 },
 {
 id: 2,
 invoice_number: 'INV-2026-0002',
 customer_id: 102,
 accountant_id: 2,
 consumption_charge_id: 9,
 outstanding_before_payment: 3200.00,
 paid_amount: 1200.00,
 remaining_balance: 2000.00,
 status: 'partially_paid',
 payment_notes: 'دفعة أولى، المتبقي مستحق الشهر القادم',
 created_at: '2026-02-15T10:00:00Z',
 updated_at: '2026-02-15T10:00:00Z',
 customer: { id: 102, name: 'مستشفى النور' },
 accountant: { id: 2, name: 'سارة محمد' },
 consumptionCharge: { id: 9, meter: { id: 202, meter_number: 'MT-9123' } }
 },
 {
 id: 3,
 invoice_number: 'INV-2026-0003',
 customer_id: 103,
 accountant_id: 3,
 consumption_charge_id: 10,
 outstanding_before_payment: 850.50,
 paid_amount: 850.50,
 remaining_balance: 0.00,
 status: 'paid',
 payment_notes: 'حوالة بنكية',
 created_at: '2026-03-05T09:30:00Z',
 updated_at: '2026-03-06T11:00:00Z',
 customer: { id: 103, name: 'محمد علي' },
 accountant: { id: 3, name: 'أحمد محمود' },
 consumptionCharge: { id: 10, meter: { id: 203, meter_number: 'MT-7731' } }
 },
 {
 id: 4,
 invoice_number: 'INV-2026-0004',
 customer_id: 104,
 accountant_id: 2,
 consumption_charge_id: 11,
 outstanding_before_payment: 5400.00,
 paid_amount: 2000.00,
 remaining_balance: 3400.00,
 status: 'partially_paid',
 payment_notes: 'شيك رقم 44921',
 created_at: '2026-03-20T14:15:00Z',
 updated_at: '2026-03-22T09:00:00Z',
 customer: { id: 104, name: 'مصنع الشرق الأوسط' },
 accountant: { id: 2, name: 'سارة محمد' },
 consumptionCharge: { id: 11, meter: { id: 204, meter_number: 'MT-1055' } }
 },
 {
 id: 5,
 invoice_number: 'INV-2026-0005',
 customer_id: 105,
 accountant_id: 3,
 consumption_charge_id: 12,
 outstanding_before_payment: 1100.00,
 paid_amount: 1100.00,
 remaining_balance: 0.00,
 status: 'paid',
 payment_notes: null,
 created_at: '2026-04-10T08:00:00Z',
 updated_at: '2026-04-10T08:00:00Z',
 customer: { id: 105, name: 'مدارس المجد' },
 accountant: { id: 3, name: 'أحمد محمود' },
 consumptionCharge: { id: 12, meter: { id: 205, meter_number: 'MT-2290' } }
 },
 {
 id: 6,
 invoice_number: 'INV-2026-0006',
 customer_id: 101,
 accountant_id: 2,
 consumption_charge_id: 13,
 outstanding_before_payment: 2100.00,
 paid_amount: 2100.00,
 remaining_balance: 0.00,
 status: 'paid',
 payment_notes: null,
 created_at: '2026-04-15T10:00:00Z',
 updated_at: '2026-04-15T10:00:00Z',
 customer: { id: 101, name: 'شركة الأفق للتجارة' },
 accountant: { id: 2, name: 'سارة محمد' },
 consumptionCharge: { id: 13, meter: { id: 201, meter_number: 'MT-8842' } }
 }
]

export const getInvoiceStats = (invoices: Invoice[]) => {
 return {
 totalInvoices: invoices.length,
 paidInvoices: invoices.filter(i => i.status === 'paid').length,
 partiallyPaidInvoices: invoices.filter(i => i.status === 'partially_paid').length,
 totalInvoicedAmount: invoices.reduce((sum, i) => sum + Number(i.outstanding_before_payment), 0),
 totalCollections: invoices.reduce((sum, i) => sum + Number(i.paid_amount), 0),
 totalOutstanding: invoices.reduce((sum, i) => sum + Number(i.remaining_balance), 0),
 }
}

export const getMonthlyChartData = (invoices: Invoice[], isRTL: boolean) => {
 const monthsData = new Map<string, { monthStr: string, invoicesAmount: number, collectionsAmount: number }>()

 // Sort invoices by date
 const sorted = [...invoices].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

 sorted.forEach(invoice => {
 const d = new Date(invoice.created_at)
 // Create a key 'YYYY-MM'
 const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

 // Format the month display name
 const monthStr = d.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', { month: 'short' })

 if (!monthsData.has(key)) {
 monthsData.set(key, { monthStr, invoicesAmount: 0, collectionsAmount: 0 })
 }

 const data = monthsData.get(key)!
 data.invoicesAmount += Number(invoice.outstanding_before_payment)
 data.collectionsAmount += Number(invoice.paid_amount)
 })

 return Array.from(monthsData.values())
}

export const getStatusDistributionData = (invoices: Invoice[]) => {
 const paid = invoices.filter(i => i.status === 'paid').length
 const partiallyPaid = invoices.filter(i => i.status === 'partially_paid').length

 return [
 { name: 'paid', value: paid },
 { name: 'partially_paid', value: partiallyPaid }
 ]
}
