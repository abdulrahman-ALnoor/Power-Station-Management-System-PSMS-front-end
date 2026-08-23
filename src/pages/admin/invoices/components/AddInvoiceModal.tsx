import React, { useEffect, useState } from 'react'
import { X, ReceiptText } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

import {
  createInvoice,
  fetchConsumptionCharges,
  type ConsumptionChargeRecord,
  type InvoiceApiRecord,
} from '@/services/invoices.service'

export interface InvoiceData {
  consumption_charge_id: number
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

  const [charges, setCharges] = useState<ConsumptionChargeRecord[]>([])
  const [consumptionChargeId, setConsumptionChargeId] = useState('')
  const [paidAmount, setPaidAmount] = useState('')
  const [paymentNotes, setPaymentNotes] = useState('')

  const [isLoadingCharges, setIsLoadingCharges] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return

    setErrorMessage(null)
    setIsLoadingCharges(true)

    fetchConsumptionCharges()
      .then((items) => {
        const unpaidCharges = items.filter(
          (item) => Number(item.remaining_amount) > 0,
        )

        setCharges(unpaidCharges)
      })
      .catch((error) => {
        const apiError = error as {
          message?: string
          status?: number
        }

        setErrorMessage(
          apiError.message ||
            `تعذر تحميل رسوم الاستهلاك${
              apiError.status
                ? ` (HTTP ${apiError.status})`
                : ''
            }`,
        )
      })
      .finally(() => {
        setIsLoadingCharges(false)
      })
  }, [isOpen])

  const selectedCharge = charges.find(
    (item) => String(item.id) === consumptionChargeId,
  )

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    setErrorMessage(null)

    const numericPaidAmount = Number(paidAmount)

    if (!consumptionChargeId) {
      setErrorMessage('اختر رسوم الاستهلاك أولًا.')
      return
    }

    if (
      !Number.isFinite(numericPaidAmount) ||
      numericPaidAmount <= 0
    ) {
      setErrorMessage('أدخل مبلغًا مدفوعًا أكبر من صفر.')
      return
    }

    if (
      selectedCharge &&
      numericPaidAmount > Number(selectedCharge.remaining_amount)
    ) {
      setErrorMessage(
        'المبلغ المدفوع أكبر من المبلغ المتبقي.',
      )
      return
    }

    setIsSubmitting(true)

    try {
      const payload: InvoiceData = {
        consumption_charge_id: Number(consumptionChargeId),
        paid_amount: numericPaidAmount,
        payment_notes:
          paymentNotes.trim() || undefined,
      }

      // إنشاء الفاتورة
      const createdInvoice = await createInvoice(payload)

      // إظهار رسالة النجاح
      window.alert('تم إنشاء الفاتورة بنجاح')

      // إرسال الفاتورة الجديدة إلى الصفحة الرئيسية
      onAdd?.(createdInvoice)

      // إعادة تعيين الحقول
      setConsumptionChargeId('')
      setPaidAmount('')
      setPaymentNotes('')

      // إغلاق المودال
      onClose()

    } catch (error) {
      const apiError = error as {
        message?: string
        status?: number
        errors?: Record<string, string[]>
      }

      const validationMessage = apiError.errors
        ? Object.values(apiError.errors)
            .flat()
            .join(' ')
        : undefined

      setErrorMessage(
        validationMessage ||
          apiError.message ||
          `تعذر إنشاء الفاتورة${
            apiError.status
              ? ` (HTTP ${apiError.status})`
              : ''
          }`,
      )
    } finally {
      setIsSubmitting(false)
    }
  }

 if (!isOpen) return null

  return (
    <>
      {/* الخلفية */}
      <div
        className="fixed inset-0 bg-black/45 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="bg-white dark:bg-surface-container-low w-full max-w-2xl rounded-2xl shadow-2xl border border-outline/10 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-outline/10">

            <div>
              <h2 className="text-xl font-semibold text-on-surface dark:text-on-dark flex items-center gap-2">
                <ReceiptText
                  size={20}
                  className="text-primary"
                />

                إنشاء فاتورة
              </h2>

              <p className="text-sm text-outline mt-2">
                اختر رسوم الاستهلاك وسجّل الدفعة.
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

          {/* Content */}
          <div className="p-6">

            <form
              id="add-invoice-form"
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* رسوم الاستهلاك */}
              <div className="space-y-2">

                <label className="block text-sm font-medium">
                  رسوم الاستهلاك *
                </label>

                <select
                  required
                  value={consumptionChargeId}
                  onChange={(event) =>
                    setConsumptionChargeId(
                      event.target.value,
                    )
                  }
                  disabled={
                    isLoadingCharges ||
                    isSubmitting
                  }
                  className="w-full border rounded-lg min-h-[44px] py-2.5 px-4"
                >
                  <option value="">
                    {isLoadingCharges
                      ? 'جاري تحميل الرسوم...'
                      : 'اختر رسوم الاستهلاك'}
                  </option>

                  {charges.map((charge) => (
                    <option
                      key={charge.id}
                      value={charge.id}
                    >
                      {charge.customer?.full_name ||
                        'عميل'}

                      {' — '}

                      المتبقي:
                      {' '}
                      {charge.remaining_amount}

                      {charge.meter?.meter_number
                        ? ` — العداد: ${charge.meter.meter_number}`
                        : ''}
                    </option>
                  ))}

                </select>

                {!isLoadingCharges &&
                  charges.length === 0 && (
                    <p className="text-sm text-outline">
                      لا توجد رسوم استهلاك عليها مبالغ متبقية.
                    </p>
                  )}

              </div>

              {/* المبلغ المدفوع */}
              <div className="space-y-2">

                <label className="block text-sm font-medium">
                  المبلغ المدفوع *
                </label>

                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={paidAmount}
                  onChange={(event) =>
                    setPaidAmount(
                      event.target.value,
                    )
                  }
                  disabled={isSubmitting}
                  className="w-full border rounded-lg min-h-[44px] py-2.5 px-4"
                />

                {selectedCharge && (
                  <p className="text-sm text-outline">
                    المبلغ المتبقي:
                    {' '}
                    <span className="font-semibold">
                      {selectedCharge.remaining_amount}
                    </span>
                  </p>
                )}

              </div>

              {/* الملاحظات */}
              <div className="space-y-2">

                <label className="block text-sm font-medium">
                  ملاحظات الدفع
                </label>

                <textarea
                  value={paymentNotes}
                  onChange={(event) =>
                    setPaymentNotes(
                      event.target.value,
                    )
                  }
                  disabled={isSubmitting}
                  rows={3}
                  className="w-full border rounded-lg py-2.5 px-4"
                />

              </div>

              {/* رسالة الخطأ */}
              {errorMessage && (
                <div
                  className="p-3 rounded-lg bg-red-50 text-red-600 text-sm"
                  role="alert"
                >
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
              className="px-6 py-2.5 rounded-lg border disabled:opacity-50"
            >
              إلغاء
            </button>

            <button
              type="submit"
              form="add-invoice-form"
              disabled={
                isSubmitting ||
                isLoadingCharges ||
                charges.length === 0
              }
              className="px-6 py-2.5 rounded-lg bg-primary text-on-primary disabled:opacity-50"
            >
              {isSubmitting
                ? 'جاري الحفظ...'
                : 'حفظ الفاتورة'}
            </button>

          </div>

        </div>
      </div>
    </>
  )
}
