import { createPortal } from 'react-dom'
import { X, Receipt, Building, Hash, Calendar, DollarSign, User } from 'lucide-react'
import { Invoice } from '../types'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

interface InvoiceDetailsModalProps {
 isOpen: boolean
 onClose: () => void
 invoice: Invoice | null
}

export function InvoiceDetailsModal({ isOpen, onClose, invoice }: InvoiceDetailsModalProps) {
 if (!isOpen || !invoice) return null

 const getStatusLabel = (status: string | null) => {
 switch (status) {
 case 'paid': return 'مدفوعة'
 case 'partially_paid': return 'مسددة جزئياً'
 default: return 'غير مدفوعة'
 }
 }

 const getStatusColor = (status: string | null) => {
 switch (status) {
 case 'paid': return 'bg-success-light text-success border-success/20'
 case 'partially_paid': return 'bg-warning-light text-warning border-warning/20'
 default: return 'bg-danger-light text-danger border-danger/20'
 }
 }

 return createPortal(
 <div 
 className="fixed inset-0 flex items-center justify-center p-4 sm:p-6"
 style={{ zIndex: 9999 }}
 dir="rtl"
 >
 <div 
 className="absolute inset-0 bg-black/60 backdrop-blur-sm"
 onClick={onClose}
 />
 
 <div className="relative bg-surface w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-border">
 {/* Header */}
 <div className="flex items-center justify-between p-6 border-b border-border bg-surface-container/30 shrink-0">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
 <Receipt size={20} />
 </div>
 <div>
 <h2 className="text-xl font-bold text-text">تفاصيل الفاتورة</h2>
 <p className="text-sm text-text-muted mt-1">{invoice.invoice_number}</p>
 </div>
 </div>
 <button 
 onClick={onClose}
 className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-text-muted hover:text-text transition-colors"
 >
 <X size={20} />
 </button>
 </div>

 {/* Content */}
 <div className="p-6 overflow-y-auto custom-scrollbar">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 
 {/* Info Group 1 */}
 <div className="space-y-4">
 <div className="flex items-start gap-3">
 <User size={18} className="text-text-muted shrink-0 mt-0.5" />
 <div>
 <p className="text-xs text-text-muted mb-1">العميل</p>
 <p className="text-sm font-bold text-text">{invoice.customer?.full_name || 'غير معروف'}</p>
 </div>
 </div>

 <div className="flex items-start gap-3">
 <Hash size={18} className="text-text-muted shrink-0 mt-0.5" />
 <div>
 <p className="text-xs text-text-muted mb-1">رقم العداد</p>
 <p className="text-sm font-medium text-text">{invoice.meter?.meter_number || 'غير معروف'}</p>
 </div>
 </div>

 <div className="flex items-start gap-3">
 <Calendar size={18} className="text-text-muted shrink-0 mt-0.5" />
 <div>
 <p className="text-xs text-text-muted mb-1">تاريخ السداد</p>
 <p className="text-sm font-medium text-text">{format(new Date(invoice.created_at), 'dd MMMM yyyy - hh:mm a', { locale: ar })}</p>
 </div>
 </div>
 </div>

 {/* Info Group 2 */}
 <div className="space-y-4">
 <div className="flex items-start gap-3">
 <Building size={18} className="text-text-muted shrink-0 mt-0.5" />
 <div>
 <p className="text-xs text-text-muted mb-1">المحاسب المسؤول</p>
 <p className="text-sm font-medium text-text">{invoice.accountant?.name || 'غير معروف'}</p>
 </div>
 </div>

 <div>
 <p className="text-xs text-text-muted mb-1">الحالة</p>
 <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(invoice.status)}`}>
 {getStatusLabel(invoice.status)}
 </span>
 </div>
 </div>

 {/* Financial Details */}
 <div className="md:col-span-2 mt-4">
 <h3 className="text-sm font-bold text-text mb-4 border-b border-border pb-2">التفاصيل المالية</h3>
 
 <div className="bg-surface-container/30 rounded-xl p-4 space-y-3">
 <div className="flex justify-between items-center pb-3 border-b border-border/50">
 <span className="text-sm text-text-muted">المبلغ قبل السداد</span>
 <span className="text-sm font-bold text-text">{invoice.outstanding_before_payment.toLocaleString()} ر.س</span>
 </div>
 
 <div className="flex justify-between items-center pb-3 border-b border-border/50">
 <span className="text-sm text-text-muted">المبلغ المدفوع</span>
 <span className="text-sm font-bold text-success">{invoice.paid_amount.toLocaleString()} ر.س</span>
 </div>

 <div className="flex justify-between items-center">
 <span className="text-sm text-text-muted">المتبقي</span>
 <span className="text-sm font-bold text-danger">{invoice.remaining_balance.toLocaleString()} ر.س</span>
 </div>
 </div>
 </div>

 {/* Notes */}
 {invoice.payment_notes && (
 <div className="md:col-span-2 mt-2">
 <h3 className="text-sm font-bold text-text mb-2">ملاحظات الدفع</h3>
 <div className="bg-surface-container/20 rounded-xl p-4 border border-border">
 <p className="text-sm text-text leading-relaxed">
 {invoice.payment_notes}
 </p>
 </div>
 </div>
 )}
 </div>
 </div>

 {/* Footer */}
 <div className="p-6 border-t border-border bg-surface-container/30 shrink-0 flex gap-3 justify-end">
 <button
 onClick={onClose}
 className="px-6 py-2.5 rounded-xl border border-border bg-surface text-text hover:bg-surface-container transition-colors text-sm font-medium"
 >
 إغلاق
 </button>
 </div>
 </div>
 </div>,
 document.body
 )
}
