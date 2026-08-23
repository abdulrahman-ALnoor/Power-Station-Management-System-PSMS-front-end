import React, { useState, useEffect } from 'react'
import { AlertCircle, Receipt, Plus } from 'lucide-react'
import { invoiceService } from '../../../services/accountant/invoiceService'
import { Invoice, GetInvoicesParams, PaginatedResponse } from './types'
import { InvoiceToolbar } from './components/InvoiceToolbar'
import { InvoiceTable } from './components/InvoiceTable'
import { InvoiceDetailsModal } from './components/InvoiceDetailsModal'
import { InvoiceFormModal } from './components/InvoiceFormModal'
import { PrintInvoiceView } from './components/PrintInvoiceView'
import { ConfirmDialog } from '@/components/overlays/ConfirmDialog'
import { mockCustomers } from '@/pages/engineer/service-requests/data/mockData'

class InvoicesErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
 constructor(props: { children: React.ReactNode }) {
 super(props)
 this.state = { hasError: false }
 }
 static getDerivedStateFromError() {
 return { hasError: true }
 }
 render() {
 if (this.state.hasError) {
 return (
 <div className="p-8 bg-surface text-center rounded-xl border border-border shadow-sm">
 <AlertCircle className="w-12 h-12 text-danger mx-auto mb-4" />
 <h2 className="text-xl font-bold mb-2 text-text">تعذر تحميل صفحة الفواتير</h2>
 <button
 onClick={() => window.location.reload()}
 className="px-4 py-2 bg-primary text-on-primary rounded-lg mt-4"
 >
 إعادة المحاولة
 </button>
 </div>
 )
 }
 return this.props.children
 }
}

export function AccountantInvoicesPage() {
 return (
 <InvoicesErrorBoundary>
 <InvoicesContent />
 </InvoicesErrorBoundary>
 )
}

function InvoicesContent() {
 const [data, setData] = useState<PaginatedResponse<Invoice> | null>(null)
 const [loading, setLoading] = useState(true)
 const [filters, setFilters] = useState<GetInvoicesParams>({ page: 1, per_page: 10 })
 const [successMessage, setSuccessMessage] = useState<string | null>(null)

 // Modals state
 const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
 const [isDetailsOpen, setIsDetailsOpen] = useState(false)
 const [isDeleteOpen, setIsDeleteOpen] = useState(false)
 const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null)
 const [isDeleting, setIsDeleting] = useState(false)

 const [isFormOpen, setIsFormOpen] = useState(false)
 const [invoiceToEdit, setInvoiceToEdit] = useState<Invoice | null>(null)

 const [printingInvoice, setPrintingInvoice] = useState<Invoice | null>(null)

 // Mock reference data for the form
 const customersList = mockCustomers.map(c => ({ id: c.id, name: c.full_name }))
 const consumptionChargesList = [
 { id: 101, meter_number: 'MTR-8932' },
 { id: 102, meter_number: 'MTR-1024' },
 { id: 103, meter_number: 'MTR-5511' }
 ]

 const fetchInvoices = async () => {
 setLoading(true)
 try {
 const response = await invoiceService.getInvoices(filters)
 setData(response)
 } catch (error) {
 console.error('Failed to fetch invoices:', error)
 } finally {
 setLoading(false)
 }
 }

 useEffect(() => {
 fetchInvoices()
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [filters])

 useEffect(() => {
 const handleAfterPrint = () => {
 setPrintingInvoice(null)
 }
 window.addEventListener('afterprint', handleAfterPrint)
 return () => window.removeEventListener('afterprint', handleAfterPrint)
 }, [])

 const showSuccess = (msg: string) => {
 setSuccessMessage(msg)
 setTimeout(() => setSuccessMessage(null), 3000)
 }

 const handleFilterChange = (newFilters: GetInvoicesParams) => {
 setFilters(newFilters)
 }

 const handleView = (invoice: Invoice) => {
 setSelectedInvoice(invoice)
 setIsDetailsOpen(true)
 }

 const handlePrint = (invoice: Invoice) => {
 setPrintingInvoice(invoice)
 setTimeout(() => {
 window.print()
 }, 100)
 }

 const handleCreate = () => {
 setInvoiceToEdit(null)
 setIsFormOpen(true)
 }

 const handleEdit = (invoice: Invoice) => {
 setInvoiceToEdit(invoice)
 setIsFormOpen(true)
 }

 const handleSaveInvoice = async (invoiceData: Partial<Invoice>) => {
 if (invoiceToEdit) {
 await invoiceService.updateInvoice(invoiceToEdit.id, invoiceData)
 showSuccess('تم تعديل الفاتورة بنجاح')
 } else {
 await invoiceService.createInvoice(invoiceData)
 showSuccess('تم إنشاء الفاتورة بنجاح')
 }
 fetchInvoices()
 }

 const handleDeleteRequest = (invoice: Invoice) => {
 setInvoiceToDelete(invoice)
 setIsDeleteOpen(true)
 }

 const handleConfirmDelete = async () => {
 if (!invoiceToDelete) return
 setIsDeleting(true)
 try {
 await invoiceService.deleteInvoice(invoiceToDelete.id)
 setIsDeleteOpen(false)
 setInvoiceToDelete(null)
 fetchInvoices() // Refresh the list
 showSuccess('تم حذف الفاتورة بنجاح')
 } catch (error) {
 console.error('Failed to delete invoice:', error)
 } finally {
 setIsDeleting(false)
 }
 }

 return (
 <div className="space-y-6 max-w-[1440px] mx-auto pb-12 animate-fade-in relative" dir="rtl">
 {successMessage && (
 <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-success text-on-success px-6 py-3 rounded-xl shadow-lg font-bold text-sm">
 {successMessage}
 </div>
 )}

 <div className="flex justify-between items-center">
 <div>
 <h1 className="text-2xl font-bold text-text mb-1">الفواتير</h1>
 </div>
 </div>

 <InvoiceToolbar
 filters={filters}
 onFilterChange={handleFilterChange}
 onCreateClick={handleCreate}
 />

 {loading && !data ? (
 <div className="bg-surface rounded-xl p-8 flex justify-center border border-border">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
 </div>
 ) : (
 <>
 <InvoiceTable
 invoices={data?.data || []}
 onView={handleView}
 onPrint={handlePrint}
 onEdit={handleEdit}
 onDelete={handleDeleteRequest}
 />

 {/* Simple Pagination */}
 {data && data.last_page > 1 && (
 <div className="flex justify-center mt-6 gap-2">
 <button
 disabled={filters.page === 1}
 onClick={() => handleFilterChange({ ...filters, page: (filters.page || 1) - 1 })}
 className="px-4 py-2 rounded-lg bg-surface border border-border disabled:opacity-50 text-sm font-medium hover:bg-surface-container transition-colors"
 >
 السابق
 </button>
 <span className="px-4 py-2 text-sm text-text-muted font-medium flex items-center">
 صفحة {data.current_page} من {data.last_page}
 </span>
 <button
 disabled={filters.page === data.last_page}
 onClick={() => handleFilterChange({ ...filters, page: (filters.page || 1) + 1 })}
 className="px-4 py-2 rounded-lg bg-surface border border-border disabled:opacity-50 text-sm font-medium hover:bg-surface-container transition-colors"
 >
 التالي
 </button>
 </div>
 )}
 </>
 )}

 {/* Modals */}
 <InvoiceDetailsModal
 isOpen={isDetailsOpen}
 onClose={() => setIsDetailsOpen(false)}
 invoice={selectedInvoice}
 />

 <InvoiceFormModal
 isOpen={isFormOpen}
 onClose={() => setIsFormOpen(false)}
 onSave={handleSaveInvoice}
 initialData={invoiceToEdit}
 customers={customersList}
 consumptionCharges={consumptionChargesList}
 />

 <ConfirmDialog
 open={isDeleteOpen}
 onClose={() => setIsDeleteOpen(false)}
 onConfirm={handleConfirmDelete}
 title="حذف الفاتورة"
 message={`هل أنت متأكد من حذف الفاتورة رقم ${invoiceToDelete?.invoice_number}؟ لا يمكن التراجع عن هذا الإجراء.`}
 loading={isDeleting}
 confirmLabel="نعم، حذف"
 cancelLabel="إلغاء"
 />
 {/* Print View (Only visible in print media query) */}
 {printingInvoice && (
 <PrintInvoiceView invoice={printingInvoice} />
 )}
 </div>
 )
}
