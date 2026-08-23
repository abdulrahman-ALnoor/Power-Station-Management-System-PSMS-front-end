import React from 'react'
import { Invoice } from '../types'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

interface PrintInvoiceViewProps {
 invoice: Invoice
}

export function PrintInvoiceView({ invoice }: PrintInvoiceViewProps) {
 const getStatusLabel = (status: string | null) => {
 switch (status) {
 case 'paid': return 'مدفوعة'
 case 'partially_paid': return 'مسددة جزئياً'
 default: return 'غير مدفوعة'
 }
 }

 return (
 <div id="print-section" className="bg-surface text-text-primary p-8 mx-auto w-full max-w-[210mm] min-h-[297mm] font-sans" dir="rtl">

 {/* COMPANY HEADER */}
 <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-8">
 <div className="flex flex-col">
 <h1 className="text-3xl font-bold mb-2">نظام البرق</h1>
 <p className="text-gray-600 text-sm">طاقة مستدامة، خدمة أفضل</p>
 </div>
 <img src="/albarq-logo.jpg" alt="Company Logo" className="w-32 h-auto object-contain mix-blend-multiply" />
 </div>

 {/* INVOICE INFORMATION */}
 <div className="text-center mb-10">
 <h2 className="text-2xl font-bold uppercase tracking-wider mb-2">فاتورة كهرباء</h2>
 <div className="inline-flex gap-8 justify-center items-center text-sm">
 <p><span className="font-bold text-gray-600 ml-2">رقم الفاتورة:</span> {invoice.invoice_number}</p>
 <p><span className="font-bold text-gray-600 ml-2">تاريخ السداد:</span> {format(new Date(invoice.created_at), 'dd MMMM yyyy', { locale: ar })}</p>
 </div>
 </div>

 {/* CUSTOMER INFORMATION */}
 <div className="border border-gray-300 rounded-lg p-6 mb-10 bg-gray-50/50">
 <h3 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2">بيانات العميل</h3>
 <div className="grid grid-cols-2 gap-4 text-sm">
 <div>
 <p className="text-gray-500 mb-1">اسم العميل</p>
 <p className="font-bold text-lg">{invoice.customer?.full_name || 'غير معروف'}</p>
 </div>
 <div>
 <p className="text-gray-500 mb-1">رقم العداد</p>
 <p className="font-bold text-lg">{invoice.meter?.meter_number || 'غير معروف'}</p>
 </div>
 </div>
 </div>

 {/* FINANCIAL SUMMARY */}
 <div className="mb-10">
 <h3 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2">الملخص المالي</h3>
 <table className="w-full text-right border-collapse border border-gray-300">
 <thead>
 <tr className="bg-gray-100">
 <th className="border border-gray-300 p-3 font-bold">البيان</th>
 <th className="border border-gray-300 p-3 font-bold">المبلغ</th>
 </tr>
 </thead>
 <tbody>
 <tr>
 <td className="border border-gray-300 p-3">المبلغ المستحق قبل السداد</td>
 <td className="border border-gray-300 p-3 font-bold">{invoice.outstanding_before_payment.toLocaleString()} ر.س</td>
 </tr>
 <tr>
 <td className="border border-gray-300 p-3">المبلغ المدفوع</td>
 <td className="border border-gray-300 p-3 font-bold">{invoice.paid_amount.toLocaleString()} ر.س</td>
 </tr>
 <tr className="bg-gray-50">
 <td className="border border-gray-300 p-3 font-bold">الرصيد المتبقي</td>
 <td className="border border-gray-300 p-3 font-bold text-lg">{invoice.remaining_balance.toLocaleString()} ر.س</td>
 </tr>
 </tbody>
 </table>
 </div>

 <div className="mb-10 flex justify-between items-end">
 <div>
 <p className="text-gray-500 mb-1">حالة الفاتورة</p>
 <p className="font-bold text-lg border-2 border-black inline-block px-4 py-1 rounded">{getStatusLabel(invoice.status)}</p>
 </div>
 {invoice.payment_notes && (
 <div className="max-w-xs text-sm border-r-2 border-gray-300 pr-4">
 <p className="text-gray-500 mb-1 font-bold">ملاحظات الدفع:</p>
 <p>{invoice.payment_notes}</p>
 </div>
 )}
 </div>

 {/* FOOTER */}
 <div className="mt-20 pt-8 border-t-2 border-black text-center text-sm text-gray-600">
 <p className="font-bold mb-1">شكراً لتعاملكم معنا</p>
 <p>الشركة العامة للكهرباء - نظام البرق</p>
 </div>

 </div>
 )
}
