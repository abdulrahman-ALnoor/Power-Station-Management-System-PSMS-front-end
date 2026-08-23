import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Calendar, Download } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { Invoice } from '../types'
import { formatCurrency } from '@/utils/currency'
import { cn } from '@/utils/cn'

interface InvoiceDetailsDrawerProps {
 invoice: Invoice | null
 isOpen: boolean
 onClose: () => void
 onDownloadPdf?: (invoiceId: number, invoiceNumber: string) => void
}

export function InvoiceDetailsDrawer({ invoice, isOpen, onClose, onDownloadPdf }: InvoiceDetailsDrawerProps) {
 const { t } = useTranslation('invoices')
 const { isRTL } = useLanguage()
 const [shouldRender, setShouldRender] = useState(false)

 useEffect(() => {
 if (isOpen) setShouldRender(true)
 else {
 const timer = setTimeout(() => setShouldRender(false), 300)
 return () => clearTimeout(timer)
 }
 }, [isOpen])

 if (!shouldRender || !invoice) return null

 const getStatusStyle = (status: string | null) => {
 switch (status) {
 case 'paid': return 'bg-green-50 text-green-600 '
 case 'partially_paid': return 'bg-amber-50 text-amber-gold '
 default: return 'bg-surface-dim text-text-primary-variant'
 }
 }

 const drawerClasses = cn(
 "fixed top-0 h-full w-full sm:w-[480px] bg-surface z-[70] shadow-2xl transition-transform duration-300 flex flex-col",
 isRTL ? "right-0" : "left-0",
 isOpen
 ? "translate-x-0"
 : (isRTL ? "translate-x-full" : "-translate-x-full")
 )

 const formatDate = (dateString: string) => {
 return new Date(dateString).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')
 }

 return (
 <>
 <div
 className={cn(
 "fixed inset-0 bg-primary/40 backdrop-blur-sm z-[60] transition-opacity duration-300",
 isOpen ? "opacity-100" : "opacity-0"
 )}
 onClick={onClose}
 />

 <div className={drawerClasses} dir={isRTL ? 'rtl' : 'ltr'}>
 {/* Header */}
 <div className="p-6 border-b border-border-variant flex justify-between items-center bg-primary text-on-primary ">
 <h3 className="font-headline-md font-bold">{t('drawer.title')}</h3>
 <button
 className="hover:bg-surface/10 :bg-surface-container-high p-2 rounded-full transition-colors"
 onClick={onClose}
 aria-label={t('drawer.close')}
 >
 <X size={20} />
 </button>
 </div>

 {/* Content */}
 <div className="flex-grow overflow-y-auto p-6 space-y-8">

 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <h4 className="font-headline-md font-bold text-primary ">{invoice.invoice_number}</h4>
 <span className={cn("px-3 py-1 rounded-full text-[12px] font-bold shadow-sm", getStatusStyle(invoice.status))}>
 {invoice.status ? t(`status.${invoice.status}`) : t('status.unspecified')}
 </span>
 </div>

 <div className="bg-surface-container-low p-4 rounded-xl space-y-4">
 <div className="flex justify-between items-center border-b border-border-variant pb-3">
 <span className="text-text-muted text-label-md">{t('drawer.outstandingBeforePayment')}</span>
 <span className="font-bold text-text-primary " dir="ltr">{formatCurrency(invoice.outstanding_before_payment, isRTL)}</span>
 </div>
 <div className="flex justify-between items-center border-b border-border-variant pb-3">
 <span className="text-text-muted text-label-md">{t('drawer.paidAmount')}</span>
 <span className="font-bold text-green-600 " dir="ltr">{formatCurrency(invoice.paid_amount, isRTL)}</span>
 </div>
 <div className="flex justify-between items-center">
 <span className="text-text-muted text-label-md">{t('drawer.remainingBalance')}</span>
 <span className="font-bold text-amber-600 " dir="ltr">{formatCurrency(invoice.remaining_balance, isRTL)}</span>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4 mt-4">
 <div className="bg-surface-low p-3 rounded-lg border border-border-variant ">
 <p className="text-label-sm text-text-muted mb-1">{t('drawer.customerName')}</p>
 <p className="font-bold text-text-primary ">{invoice.customer?.name || '-'}</p>
 </div>
 <div className="bg-surface-low p-3 rounded-lg border border-border-variant ">
 <p className="text-label-sm text-text-muted mb-1">{t('drawer.accountant')}</p>
 <p className="font-bold text-text-primary ">{invoice.accountant?.name || '-'}</p>
 </div>
 <div className="bg-surface-low p-3 rounded-lg border border-border-variant ">
 <p className="text-label-sm text-text-muted mb-1">{t('drawer.createdAt')}</p>
 <p className="font-bold text-text-primary flex items-center gap-2">
 <Calendar size={14} className="text-text-muted" />
 <span dir="ltr">{formatDate(invoice.created_at)}</span>
 </p>
 </div>
 <div className="bg-surface-low p-3 rounded-lg border border-border-variant ">
 <p className="text-label-sm text-text-muted mb-1">{t('drawer.updatedAt')}</p>
 <p className="font-bold text-text-primary flex items-center gap-2">
 <Calendar size={14} className="text-text-muted" />
 <span dir="ltr">{formatDate(invoice.updated_at)}</span>
 </p>
 </div>
 </div>
 </div>

 {/* Notes */}
 <div className="space-y-4">
 <h5 className="font-body-md font-bold border-b border-border-variant pb-2 text-text-primary ">
 {t('drawer.paymentNotes')}
 </h5>
 <div className="bg-surface-low p-4 rounded-xl border border-border-variant ">
 {invoice.payment_notes ? (
 <p className="text-body-md text-text-primary-variant whitespace-pre-wrap leading-relaxed">
 {invoice.payment_notes}
 </p>
 ) : (
 <p className="text-body-md text-text-muted italic">{t('drawer.noNotes')}</p>
 )}
 </div>
 </div>

 </div>

 {/* Footer Actions */}
 <div className="p-6 border-t border-border-variant bg-surface-low flex gap-3 shrink-0">
 <button 
  onClick={() => invoice && onDownloadPdf?.(invoice.id, invoice.invoice_number)}
  className="flex-1 bg-primary text-on-primary py-3 rounded-lg font-bold hover:bg-primary-container transition-colors flex items-center justify-center gap-2"
 >
  <Download size={18} />
  {t('drawer.downloadPdf')}
 </button>
 </div>
 </div>
 </>
 )
}
