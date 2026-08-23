import React, { useEffect, useState } from 'react'
import { X, ReceiptText } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

import {
  showSuccess,
  showError,
} from '@/utils/toast'

import {
  createInvoice,
  fetchCustomersDropdown,
  fetchCustomerMeters,
  fetchMeterConsumptionCharges,
  type CustomerOption,
  type MeterOption,
  type ConsumptionChargeRecord,
  type InvoiceApiRecord,
} from '@/services/invoices.service'

export interface InvoiceData {
  consumption_charge_id: number
  customer_id?: number
  meter_id?: number
  paid_amount: number
  payment_notes?: string
}

interface AddInvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd?: (invoice: InvoiceApiRecord) => void
}

export function AddInvoiceModal({
  isOpen,
  onClose,
  onAdd,
}: AddInvoiceModalProps) {
  const { isRTL } = useLanguage()

  // Dropdown lists
  const [customers, setCustomers] = useState<CustomerOption[]>([])
  const [meters, setMeters] = useState<MeterOption[]>([])
  const [charges, setCharges] = useState<ConsumptionChargeRecord[]>([])

  // Selected values
  const [customerId, setCustomerId] = useState('')
  const [meterId, setMeterId] = useState('')
  const [consumptionChargeId, setConsumptionChargeId] = useState('')
  const [paidAmount, setPaidAmount] = useState('')
  const [paymentNotes, setPaymentNotes] = useState('')

  // Loading states
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false)
  const [isLoadingMeters, setIsLoadingMeters] = useState(false)
  const [isLoadingCharges, setIsLoadingCharges] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // 1. عند فتح النافذة: جلب قائمة العملاء
  useEffect(() => {
    if (!isOpen) return

    setErrorMessage(null)
    setCustomerId('')
    setMeterId('')
    setConsumptionChargeId('')
    setPaidAmount('')
    setPaymentNotes('')
    setMeters([])
    setCharges([])

    setIsLoadingCustomers(true)

    fetchCustomersDropdown()
      .then((items) => {
        setCustomers(items)
      })
      .catch((error) => {
        const apiError = error as { message?: string }
        setErrorMessage(apiError.message || 'تعذر تحميل قائمة العملاء.')
      })
      .finally(() => {
        setIsLoadingCustomers(false)
      })
  }, [isOpen])

  // 2. عند تغيير العميل: جلب عدادات العميل المحدد فقط
  const handleCustomerChange = (newCustomerId: string) => {
    setCustomerId(newCustomerId)
    setMeterId('')
    setConsumptionChargeId('')
    setPaidAmount('')
    setMeters([])
    setCharges([])
    setErrorMessage(null)

    if (!newCustomerId) return

    setIsLoadingMeters(true)
    fetchCustomerMeters(Number(newCustomerId))
      .then((items) => {
        setMeters(items)
      })
      .catch((error) => {
        const apiError = error as { message?: string }
        setErrorMessage(apiError.message || 'تعذر تحميل عدادات العميل.')
      })
      .finally(() => {
        setIsLoadingMeters(false)
      })
  }

  // 3. عند تغيير العداد: جلب رسوم الاستهلاك غير المسددة لهذا العميل والعداد فقط
  const handleMeterChange = (newMeterId: string) => {
    setMeterId(newMeterId)
    setConsumptionChargeId('')
    setPaidAmount('')
    setCharges([])
    setErrorMessage(null)

    if (!newMeterId || !customerId) return

    setIsLoadingCharges(true)
    fetchMeterConsumptionCharges(Number(customerId), Number(newMeterId))
      .then((items) => {
        const unpaid = items.filter((item) => Number(item.remaining_amount) > 0)
        setCharges(unpaid)
      })
      .catch((error) => {
        const apiError = error as { message?: string }
        setErrorMessage(apiError.message || 'تعذر تحميل رسوم استهلاك العداد.')
      })
      .finally(() => {
        setIsLoadingCharges(false)
      })
  }

  // 4. عند اختيار رسوم الاستهلاك: ضبط المبلغ التلقائي بالمبلغ المتبقي
  const handleChargeChange = (newChargeId: string) => {
    setConsumptionChargeId(newChargeId)
    setErrorMessage(null)

    const found = charges.find((c) => String(c.id) === newChargeId)
    if (found) {
      setPaidAmount(String(found.remaining_amount))
    } else {
      setPaidAmount('')
    }
  }

  const selectedCharge = charges.find(
    (item) => String(item.id) === consumptionChargeId,
  )

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)

    const numericPaidAmount = Number(paidAmount)

    if (!customerId) {
      setErrorMessage('اختر العميل أولًا.')
      return
    }

    if (!meterId) {
      setErrorMessage('اختر العداد أولًا.')
      return
    }

    if (!consumptionChargeId) {
      setErrorMessage('اختر رسوم الاستهلاك أولًا.')
      return
    }

    if (!Number.isFinite(numericPaidAmount) || numericPaidAmount <= 0) {
      setErrorMessage('أدخل مبلغًا مدفوعًا أكبر من صفر.')
      return
    }

    if (selectedCharge && numericPaidAmount > Number(selectedCharge.remaining_amount)) {
      setErrorMessage('المبلغ المدفوع أكبر من المبلغ المتبقي.')
      return
    }

    setIsSubmitting(true)

    try {
      const payload: InvoiceData = {
        customer_id: Number(customerId),
        meter_id: Number(meterId),
        consumption_charge_id: Number(consumptionChargeId),
        paid_amount: numericPaidAmount,
        payment_notes: paymentNotes.trim() || undefined,
      }

      const createdInvoice = await createInvoice(payload)

      onAdd?.(createdInvoice)

      setCustomerId('')
      setMeterId('')
      setConsumptionChargeId('')
      setPaidAmount('')
      setPaymentNotes('')

      onClose()

      showSuccess('تم إنشاء الفاتورة بنجاح.', 'تمت الإضافة بنجاح')
    } catch (error) {
      const apiError = error as {
        message?: string
        status?: number
        errors?: Record<string, string[]>
      }

      const validationMessage = apiError.errors
        ? Object.values(apiError.errors).flat().join(' ')
        : undefined

      const msg =
        validationMessage ||
        apiError.message ||
        'تعذر إنشاء الفاتورة. يرجى المحاولة مرة أخرى.'

      setErrorMessage(msg)
      showError(msg, 'فشلت عملية الإضافة')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-black/45 z-40" onClick={onClose} />

      {/* Modal Container */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="bg-white dark:bg-surface-container-low w-full max-w-2xl rounded-2xl shadow-2xl border border-outline/10 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-outline/10">
            <div>
              <h2 className="text-xl font-semibold text-on-surface dark:text-on-dark flex items-center gap-2">
                <ReceiptText size={20} className="text-primary" />
                إنشاء فاتورة جديدة
              </h2>
              <p className="text-sm text-outline mt-1">
                اختر العميل، ثم العداد، ثم رسم الاستهلاك وسجّل الدفعة.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              aria-label="إغلاق"
              className="p-2 rounded-full hover:bg-surface-variant disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <form id="add-invoice-form" onSubmit={handleSubmit} className="space-y-5">
              {/* 1. اختيار العميل */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                  العميل *
                </label>
                <select
                  required
                  value={customerId}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                  disabled={isLoadingCustomers || isSubmitting}
                  className="w-full border rounded-lg min-h-[44px] py-2.5 px-4 bg-surface dark:bg-surface-container-low text-on-surface dark:text-on-dark"
                >
                  <option value="">
                    {isLoadingCustomers ? 'جاري تحميل العملاء...' : '-- اختر العميل --'}
                  </option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.full_name} {c.customer_number ? `(${c.customer_number})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. اختيار العداد */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                  العداد *
                </label>
                <select
                  required
                  value={meterId}
                  onChange={(e) => handleMeterChange(e.target.value)}
                  disabled={!customerId || isLoadingMeters || isSubmitting}
                  className="w-full border rounded-lg min-h-[44px] py-2.5 px-4 bg-surface dark:bg-surface-container-low text-on-surface dark:text-on-dark disabled:opacity-50"
                >
                  <option value="">
                    {!customerId
                      ? '-- اختر العميل أولًا --'
                      : isLoadingMeters
                      ? 'جاري تحميل العدادات...'
                      : '-- اختر العداد --'}
                  </option>
                  {meters.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.meter_number} {m.installation_location ? `— الموقع: ${m.installation_location}` : ''}
                    </option>
                  ))}
                </select>

                {customerId && !isLoadingMeters && meters.length === 0 && (
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    لا توجد عدادات مرتبطة بهذا العميل.
                  </p>
                )}
              </div>

              {/* 3. اختيار رسم الاستهلاك */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                  رسم الاستهلاك المستحق *
                </label>
                <select
                  required
                  value={consumptionChargeId}
                  onChange={(e) => handleChargeChange(e.target.value)}
                  disabled={!meterId || isLoadingCharges || isSubmitting}
                  className="w-full border rounded-lg min-h-[44px] py-2.5 px-4 bg-surface dark:bg-surface-container-low text-on-surface dark:text-on-dark disabled:opacity-50"
                >
                  <option value="">
                    {!meterId
                      ? '-- اختر العداد أولًا --'
                      : isLoadingCharges
                      ? 'جاري تحميل رسوم الاستهلاك...'
                      : '-- اختر رسم الاستهلاك --'}
                  </option>
                  {charges.map((c) => (
                    <option key={c.id} value={c.id}>
                      رسوم #{c.id} — الإجمالي: {c.total_amount} — المتبقي: {c.remaining_amount}
                    </option>
                  ))}
                </select>

                {meterId && !isLoadingCharges && charges.length === 0 && (
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    لا توجد رسوم استهلاك مستحقة لهذا العداد.
                  </p>
                )}
              </div>

              {/* Card Summary for Selected Charge */}
              {selectedCharge && (
                <div className="p-4 bg-surface-container-low dark:bg-surface-container/50 border border-outline/20 rounded-xl space-y-2 mt-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-outline">العميل:</span>{' '}
                      <span className="font-bold text-on-surface dark:text-on-dark">
                        {selectedCharge.customer?.full_name || 'غير محدد'}
                      </span>
                    </div>
                    <div>
                      <span className="text-outline">العداد:</span>{' '}
                      <span className="font-bold text-on-surface dark:text-on-dark">
                        {selectedCharge.meter?.meter_number || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-outline">إجمالي الرسوم:</span>{' '}
                      <span className="font-bold text-on-surface dark:text-on-dark">
                        {selectedCharge.total_amount}
                      </span>
                    </div>
                    <div>
                      <span className="text-outline">المدفوع سابقًا:</span>{' '}
                      <span className="font-bold text-on-surface dark:text-on-dark">
                        {selectedCharge.paid_amount || 0}
                      </span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-outline/10 flex justify-between items-center text-sm">
                    <span className="font-medium text-outline">المبلغ المتبقي المستحق:</span>
                    <span className="font-bold text-base text-primary">
                      {selectedCharge.remaining_amount}
                    </span>
                  </div>
                </div>
              )}

              {/* 4. المبلغ المدفوع */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                  المبلغ المدفوع *
                </label>
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={paidAmount}
                  onChange={(event) => setPaidAmount(event.target.value)}
                  disabled={!consumptionChargeId || isSubmitting}
                  className="w-full border rounded-lg min-h-[44px] py-2.5 px-4 bg-surface dark:bg-surface-container-low text-on-surface dark:text-on-dark disabled:opacity-50"
                  placeholder="0.00"
                />
              </div>

              {/* 5. ملاحظات الدفع */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                  ملاحظات الدفع
                </label>
                <textarea
                  value={paymentNotes}
                  onChange={(event) => setPaymentNotes(event.target.value)}
                  disabled={isSubmitting}
                  rows={2}
                  className="w-full border rounded-lg py-2.5 px-4 bg-surface dark:bg-surface-container-low text-on-surface dark:text-on-dark"
                  placeholder="أي ملاحظات إضافية على عملية الدفع..."
                />
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm" role="alert">
                  {errorMessage}
                </div>
              )}
            </form>
          </div>

          {/* Footer */}
          <div className="p-6 pt-4 border-t border-outline/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg border text-on-surface dark:text-on-dark hover:bg-surface-variant disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              form="add-invoice-form"
              disabled={
                isSubmitting ||
                !consumptionChargeId ||
                !paidAmount ||
                Number(paidAmount) <= 0
              }
              className="px-6 py-2.5 rounded-lg bg-primary text-on-primary font-bold hover:bg-primary-dark disabled:opacity-50"
            >
              {isSubmitting ? 'جاري الحفظ...' : 'حفظ وإنشاء الفاتورة'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
