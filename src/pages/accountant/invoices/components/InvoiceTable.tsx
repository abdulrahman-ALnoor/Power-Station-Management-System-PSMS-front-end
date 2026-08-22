import { MoreVertical, Eye, Printer, Trash2, Edit2 } from 'lucide-react'
import { Invoice } from '../types'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import { useState, useRef, useEffect } from 'react'

interface InvoiceTableProps {
 invoices: Invoice[]
 onView: (invoice: Invoice) => void
 onPrint: (invoice: Invoice) => void
 onEdit: (invoice: Invoice) => void
 onDelete: (invoice: Invoice) => void
}

export function InvoiceTable({ invoices, onView, onPrint, onEdit, onDelete }: InvoiceTableProps) {
 const [openMenuId, setOpenMenuId] = useState<number | null>(null)
 const menuRef = useRef<HTMLDivElement>(null)

 useEffect(() => {
 function handleClickOutside(event: MouseEvent) {
 if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
 setOpenMenuId(null)
 }
 }
 document.addEventListener('mousedown', handleClickOutside)
 return () => document.removeEventListener('mousedown', handleClickOutside)
 }, [])



 if (invoices.length === 0) {
 return (
 <div className="bg-surface rounded-xl border border-border shadow-sm p-12 flex flex-col items-center justify-center text-center">
 <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
 <Receipt size={32} className="text-text-muted opacity-50" />
 </div>
 <h3 className="text-lg font-bold text-text mb-2">لا توجد فواتير</h3>
 <p className="text-text-muted max-w-md">لم يتم العثور على أي فواتير تطابق معايير البحث الحالية.</p>
 </div>
 )
 }

 return (
 <div className="bg-surface rounded-xl border border-border shadow-sm overflow-visible">
 <div className="overflow-x-auto min-h-[300px]">
 <table className="w-full text-right border-collapse">
 <thead>
 <tr className="border-b border-border bg-surface-container/30">
 <th className="py-4 px-4 text-sm font-semibold text-text-muted whitespace-nowrap">رقم الفاتورة</th>
 <th className="py-4 px-4 text-sm font-semibold text-text-muted whitespace-nowrap">العميل</th>
 <th className="py-4 px-4 text-sm font-semibold text-text-muted whitespace-nowrap">رقم العداد</th>
 <th className="py-4 px-4 text-sm font-semibold text-text-muted whitespace-nowrap">المبلغ قبل السداد</th>
 <th className="py-4 px-4 text-sm font-semibold text-text-muted whitespace-nowrap">المدفوع</th>
 <th className="py-4 px-4 text-sm font-semibold text-text-muted whitespace-nowrap">المتبقي</th>

 <th className="py-4 px-4 text-sm font-semibold text-text-muted whitespace-nowrap">تاريخ السداد</th>
 <th className="py-4 px-4 text-sm font-semibold text-text-muted whitespace-nowrap text-center w-16">الإجراءات</th>
 </tr>
 </thead>
 <tbody>
 {invoices.map((inv) => (
 <tr key={inv.id} className="border-b border-border hover:bg-surface-container/10 transition-colors">
 <td className="py-4 px-4 text-sm font-bold text-text whitespace-nowrap">{inv.invoice_number}</td>
 <td className="py-4 px-4 text-sm font-medium text-text whitespace-nowrap">{inv.customer?.full_name || '-'}</td>
 <td className="py-4 px-4 text-sm text-text-muted whitespace-nowrap">{inv.meter?.meter_number || '-'}</td>
 <td className="py-4 px-4 text-sm font-bold text-text whitespace-nowrap">{inv.outstanding_before_payment.toLocaleString()} ر.س</td>
 <td className="py-4 px-4 text-sm font-bold text-success whitespace-nowrap">{inv.paid_amount.toLocaleString()} ر.س</td>
 <td className="py-4 px-4 text-sm font-bold text-danger whitespace-nowrap">{inv.remaining_balance.toLocaleString()} ر.س</td>

 <td className="py-4 px-4 text-sm text-text-muted whitespace-nowrap">
 {format(new Date(inv.created_at), 'dd MMM yyyy', { locale: ar })}
 </td>
 <td className="py-4 px-4 text-sm text-center relative whitespace-nowrap">
 <button 
 className="p-2 hover:bg-surface-container rounded-lg text-text-muted hover:text-text transition-colors"
 onClick={() => setOpenMenuId(openMenuId === inv.id ? null : inv.id)}
 >
 <MoreVertical size={18} />
 </button>

 {/* Actions Dropdown */}
 {openMenuId === inv.id && (
 <div 
 ref={menuRef}
 className="absolute left-6 top-10 w-48 bg-surface rounded-xl shadow-xl border border-border overflow-hidden z-50 animate-fade-in"
 >
 <button 
 onClick={() => {
 onView(inv)
 setOpenMenuId(null)
 }}
 className="w-full text-right px-4 py-3 text-sm text-text hover:bg-surface-container flex items-center gap-3 transition-colors"
 >
 <Eye size={16} className="text-primary" />
 عرض التفاصيل
 </button>
 <button 
 onClick={() => {
 onEdit(inv)
 setOpenMenuId(null)
 }}
 className="w-full text-right px-4 py-3 text-sm text-text hover:bg-surface-container flex items-center gap-3 transition-colors"
 >
 <Edit2 size={16} className="text-warning" />
 تعديل الفاتورة
 </button>
 <button 
 onClick={() => {
 onPrint(inv)
 setOpenMenuId(null)
 }}
 className="w-full text-right px-4 py-3 text-sm text-text hover:bg-surface-container flex items-center gap-3 transition-colors"
 >
 <Printer size={16} className="text-info" />
 طباعة الفاتورة
 </button>
 <div className="h-px bg-border my-1" />
 <button 
 onClick={() => {
 onDelete(inv)
 setOpenMenuId(null)
 }}
 className="w-full text-right px-4 py-3 text-sm text-danger hover:bg-danger-light flex items-center gap-3 transition-colors"
 >
 <Trash2 size={16} />
 حذف الفاتورة
 </button>
 </div>
 )}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )
}

// Ensure Receipt is imported for the empty state
import { Receipt } from 'lucide-react'
