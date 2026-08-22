import React from 'react'
import { FileText, Receipt } from 'lucide-react'
import type { Invoice } from '@/pages/accountant/invoices/types'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

interface LatestCollectionsTableProps {
  data: Invoice[]
  isLoading?: boolean
}

export function LatestCollectionsTable({ data, isLoading }: LatestCollectionsTableProps) {
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

  if (isLoading) {
    return (
      <div className="card h-full flex flex-col animate-pulse">
        <div className="h-6 w-48 bg-surface-container rounded mb-6"></div>
        <div className="flex-1 space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-surface-container rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <Receipt size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text">آخر التحصيلات</h3>
          <p className="text-sm text-text-muted">آخر عمليات تحصيل الدفعات</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-x-auto" dir="rtl">
        {data && data.length > 0 ? (
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-container/30">
                <th className="py-4 px-4 text-sm font-semibold text-text-muted whitespace-nowrap">العميل</th>
                <th className="py-4 px-4 text-sm font-semibold text-text-muted whitespace-nowrap">رقم الفاتورة</th>
                <th className="py-4 px-4 text-sm font-semibold text-text-muted whitespace-nowrap">المبلغ المدفوع</th>
                <th className="py-4 px-4 text-sm font-semibold text-text-muted whitespace-nowrap">الرصيد المتبقي</th>
                <th className="py-4 px-4 text-sm font-semibold text-text-muted whitespace-nowrap">حالة الفاتورة</th>
                <th className="py-4 px-4 text-sm font-semibold text-text-muted whitespace-nowrap">تاريخ التحصيل</th>
              </tr>
            </thead>
            <tbody>
              {data.map(inv => (
                <tr key={inv.id} className="border-b border-border hover:bg-surface-container/10 transition-colors">
                  <td className="py-4 px-4 text-sm font-medium text-text whitespace-nowrap">{inv.customer?.full_name || '-'}</td>
                  <td className="py-4 px-4 text-sm text-text-muted whitespace-nowrap">{inv.invoice_number}</td>
                  <td className="py-4 px-4 text-sm font-bold text-success whitespace-nowrap">{inv.paid_amount.toLocaleString()} ر.س</td>
                  <td className="py-4 px-4 text-sm font-bold text-danger whitespace-nowrap">{inv.remaining_balance.toLocaleString()} ر.س</td>
                  <td className="py-4 px-4 text-sm whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(inv.status)}`}>
                      {getStatusLabel(inv.status)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-text-muted whitespace-nowrap">
                    {format(new Date(inv.updated_at), 'dd MMM yyyy', { locale: ar })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-text-muted border border-border rounded-xl">
            <FileText className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-medium">لا توجد تحصيلات حالياً</p>
          </div>
        )}
      </div>
    </div>
  )
}
