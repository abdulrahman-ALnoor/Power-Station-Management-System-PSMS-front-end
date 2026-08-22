import React, { useState, useEffect } from 'react'
import { X, Save, AlertCircle } from 'lucide-react'
import { Invoice } from '../types'

interface InvoiceFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Invoice>) => Promise<void>
  initialData?: Invoice | null
  customers: { id: number; name: string }[]
  consumptionCharges: { id: number; meter_number?: string; title?: string; period?: string; amount?: number }[]
}

export function InvoiceFormModal({ isOpen, onClose, onSave, initialData, customers, consumptionCharges }: InvoiceFormModalProps) {
  const [formData, setFormData] = useState({
    customer_id: '',
    consumption_charge_id: '',
    amount: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          customer_id: initialData.customer_id.toString(),
          consumption_charge_id: initialData.consumption_charge_id?.toString() || '',
          amount: initialData.outstanding_before_payment.toString()
        })
      } else {
        setFormData({
          customer_id: '',
          consumption_charge_id: '',
          amount: ''
        })
      }
      setError(null)
    }
  }, [isOpen, initialData])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.customer_id) {
      setError('يرجى اختيار العميل')
      return
    }
    if (!formData.consumption_charge_id) {
      setError('يرجى اختيار العداد')
      return
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      setError('يرجى إدخال المبلغ بشكل صحيح')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const amountNum = Number(formData.amount)
      const payload: Partial<Invoice> = {
        customer_id: Number(formData.customer_id),
        consumption_charge_id: Number(formData.consumption_charge_id),
        // Since invoice creation is the payment event, the amount entered represents the invoice total.
        // We pass it to the mock backend which handles the rest.
        outstanding_before_payment: amountNum,
        paid_amount: amountNum
      }

      await onSave(payload)
      onClose()
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء حفظ الفاتورة')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" dir="rtl">
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface-container/30">
          <h2 className="text-xl font-bold text-text">
            {initialData ? `تعديل الفاتورة - ${initialData.invoice_number}` : 'إنشاء فاتورة جديدة'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-variant rounded-full text-text-muted transition-colors"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {error && (
            <div className="mb-6 p-4 bg-danger-light text-danger rounded-xl flex items-center gap-3 border border-danger/20">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form id="invoice-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* بيانات الفاتورة */}
            <div>
              <h3 className="text-sm font-bold text-primary mb-4 pb-2 border-b border-border">بيانات الفاتورة</h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">العميل *</label>
                  <select
                    className="form-input w-full"
                    value={formData.customer_id}
                    onChange={e => setFormData({ ...formData, customer_id: e.target.value })}
                    disabled={loading}
                  >
                    <option value="">-- اختر العميل --</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text mb-2">العداد *</label>
                  <select
                    className="form-input w-full"
                    value={formData.consumption_charge_id}
                    onChange={e => setFormData({ ...formData, consumption_charge_id: e.target.value })}
                    disabled={loading}
                  >
                    <option value="">-- اختر العداد --</option>
                    {consumptionCharges.map(c => (
                      <option key={c.id} value={c.id}>{c.meter_number || c.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text mb-2">المبلغ (ر.س) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-input w-full"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex justify-end gap-3 bg-surface-container/30 mt-auto">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl border border-border bg-surface text-text hover:bg-surface-variant transition-colors font-medium text-sm"
          >
            إلغاء
          </button>
          <button
            type="submit"
            form="invoice-form"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary/90 transition-colors font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></span>
            ) : (
              <Save size={18} />
            )}
            {initialData ? 'حفظ التعديلات' : 'إنشاء الفاتورة'}
          </button>
        </div>

      </div>
    </div>
  )
}
