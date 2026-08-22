import { useEffect, useState } from 'react'
import { X, ReceiptText, User, Wallet } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

import {
  updateInvoice,
  type InvoiceApiRecord,
  type UpdateInvoicePayload,
} from '@/services/invoices.service'

interface EditInvoiceModalProps {
  isOpen: boolean
  invoice: InvoiceApiRecord | null
  onClose: () => void
  onUpdated?: (invoice: InvoiceApiRecord) => void
}

export function EditInvoiceModal({
  isOpen,
  invoice,
  onClose,
  onUpdated,
}: EditInvoiceModalProps) {
  const { isRTL } = useLanguage()

  const [paidAmount, setPaidAmount] = useState('')
  const [paymentNotes, setPaymentNotes] = useState('')
  const [status, setStatus] = useState<'paid' | 'partially_paid'>(
    'partially_paid',
  )

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!invoice) return

    setPaidAmount(String(invoice.paid_amount ?? ''))
    setPaymentNotes(invoice.payment_notes ?? '')
    setStatus(
      invoice.status === 'paid'
        ? 'paid'
        : 'partially_paid',
    )

    setErrorMessage(null)
  }, [invoice])

  if (!isOpen || !invoice) return null

  const outstandingBeforePayment =
    Number(invoice.paid_amount) +
    Number(invoice.remaining_balance)

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    setErrorMessage(null)

    const numericPaidAmount = Number(paidAmount)

    if (
      !Number.isFinite(numericPaidAmount) ||
      numericPaidAmount <= 0
    ) {
      setErrorMessage(
        'أدخل مبلغًا صحيحًا أكبر من صفر.',
      )
      return
    }

    if (
      numericPaidAmount >
      outstandingBeforePayment
    ) {
      setErrorMessage(
        'المبلغ المدفوع لا يمكن أن يكون أكبر من المبلغ المستحق.',
      )
      return
    }

    const remainingBalance =
      outstandingBeforePayment -
      numericPaidAmount

    const calculatedStatus =
      remainingBalance <= 0
        ? 'paid'
        : 'partially_paid'

    setIsSubmitting(true)

    try {
      const payload: UpdateInvoicePayload = {
        paid_amount: numericPaidAmount,
        remaining_balance: Math.max(
          0,
          remainingBalance,
        ),
        status: calculatedStatus,
        payment_notes:
          paymentNotes.trim() || undefined,
      }

      const updatedInvoice =
        await updateInvoice(
          invoice.id,
          payload,
        )

      onUpdated?.(updatedInvoice)

      window.alert(
        'تم تعديل الفاتورة بنجاح',
      )

      onClose()
    } catch (error) {
      const apiError = error as {
        message?: string
        status?: number
        errors?: Record<string, string[]>
      }

      const validationMessage =
        apiError.errors
          ? Object.values(apiError.errors)
              .flat()
              .join(' ')
          : undefined

      setErrorMessage(
        validationMessage ||
          apiError.message ||
          `تعذر تعديل الفاتورة${
            apiError.status
              ? ` (HTTP ${apiError.status})`
              : ''
          }`,
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* الخلفية */}
      <div
        className="fixed inset-0 bg-black/45 z-40"
        onClick={onClose}
      />

      {/* النافذة */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="bg-white dark:bg-surface-container-low w-full max-w-3xl rounded-2xl shadow-2xl border border-outline/10 overflow-hidden max-h-[90vh] overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-outline/10">

            <div>
              <h2 className="text-xl font-semibold text-on-surface dark:text-on-dark flex items-center gap-2">
                <ReceiptText
                  size={22}
                  className="text-primary"
                />

                تعديل الفاتورة
              </h2>

              <p className="text-sm text-outline mt-2">
                يمكنك مراجعة بيانات الفاتورة وتعديل بيانات الدفع.
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

          <form
            id="edit-invoice-form"
            onSubmit={handleSubmit}
          >

            <div className="p-6 space-y-6">

              {/* بيانات الفاتورة */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <ReceiptText
                    size={20}
                    className="text-primary"
                  />

                  <h3 className="font-semibold text-lg">
                    بيانات الفاتورة
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="border rounded-xl p-4 bg-surface-container-lowest">
                    <p className="text-sm text-outline mb-1">
                      رقم الفاتورة
                    </p>

                    <p className="font-semibold">
                      {invoice.invoice_number}
                    </p>
                  </div>

                  <div className="border rounded-xl p-4 bg-surface-container-lowest">
                    <p className="text-sm text-outline mb-1">
                      تاريخ الإنشاء
                    </p>

                    <p className="font-semibold">
                      {new Date(
                        invoice.created_at,
                      ).toLocaleDateString(
                        'ar-YE',
                      )}
                    </p>
                  </div>

                </div>
              </div>

              {/* بيانات العميل */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <User
                    size={20}
                    className="text-primary"
                  />

                  <h3 className="font-semibold text-lg">
                    بيانات العميل
                  </h3>
                </div>

                <div className="border rounded-xl p-4 bg-surface-container-lowest">

                  <p className="text-sm text-outline mb-1">
                    اسم العميل
                  </p>

                  <p className="font-semibold">
                    {invoice.customer?.name ||
                      'غير محدد'}
                  </p>

                </div>
              </div>

              {/* تفاصيل الاستهلاك */}
              <div>

                <h3 className="font-semibold text-lg mb-4">
                  تفاصيل الاستهلاك
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="border rounded-xl p-4">
                    <p className="text-sm text-outline mb-1">
                      إجمالي رسوم الاستهلاك
                    </p>

                    <p className="font-bold text-lg">
                      {Number(
                        invoice.consumption_charge
                          ?.total_amount ?? 0,
                      ).toLocaleString()}
                      {' '}
                      ريال
                    </p>
                  </div>

                  <div className="border rounded-xl p-4">
                    <p className="text-sm text-outline mb-1">
                      المتبقي قبل التعديل
                    </p>

                    <p className="font-bold text-lg">
                      {Number(
                        invoice.remaining_balance,
                      ).toLocaleString()}
                      {' '}
                      ريال
                    </p>
                  </div>

                </div>

              </div>

              {/* تفاصيل الدفع */}
              <div>

                <div className="flex items-center gap-2 mb-4">
                  <Wallet
                    size={20}
                    className="text-primary"
                  />

                  <h3 className="font-semibold text-lg">
                    تفاصيل الدفع
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* المبلغ المستحق */}
                  <div className="border rounded-xl p-4 bg-surface-container-lowest">

                    <p className="text-sm text-outline mb-1">
                      المبلغ المستحق
                    </p>

                    <p className="font-bold text-lg">
                      {outstandingBeforePayment.toLocaleString()}
                      {' '}
                      ريال
                    </p>

                  </div>

                  {/* المبلغ المدفوع */}
                  <div className="space-y-2">

                    <label className="block text-sm font-medium">
                      المبلغ المدفوع الجديد *
                    </label>

                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      value={paidAmount}
                      onChange={(event) =>
                        setPaidAmount(
                          event.target.value,
                        )
                      }
                      disabled={isSubmitting}
                      className="w-full border rounded-xl min-h-[48px] py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />

                  </div>

                  {/* المتبقي بعد التعديل */}
                  <div className="border rounded-xl p-4">

                    <p className="text-sm text-outline mb-1">
                      المبلغ المتبقي بعد التعديل
                    </p>

                    <p className="font-bold text-lg text-primary">

                      {Math.max(
                        0,
                        outstandingBeforePayment -
                          (Number(
                            paidAmount,
                          ) || 0),
                      ).toLocaleString()}

                      {' '}
                      ريال

                    </p>

                  </div>

                  {/* حالة الفاتورة */}
                  <div className="border rounded-xl p-4">

                    <p className="text-sm text-outline mb-1">
                      حالة الفاتورة
                    </p>

                    <p className="font-bold">

                      {Math.max(
                        0,
                        outstandingBeforePayment -
                          (Number(
                            paidAmount,
                          ) || 0),
                      ) === 0
                        ? 'مدفوعة بالكامل'
                        : 'مدفوعة جزئيًا'}

                    </p>

                  </div>

                </div>

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
                  rows={4}
                  placeholder="أضف ملاحظات حول عملية الدفع..."
                  className="w-full border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />

              </div>

              {/* رسالة الخطأ */}
              {errorMessage && (

                <div
                  className="p-4 rounded-xl bg-red-50 text-red-600 text-sm"
                  role="alert"
                >
                  {errorMessage}
                </div>

              )}

            </div>

          </form>

          {/* Footer */}
          <div className="p-6 border-t border-outline/10 flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl border disabled:opacity-50"
            >
              إلغاء
            </button>

            <button
              type="submit"
              form="edit-invoice-form"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-semibold disabled:opacity-50"
            >
              {isSubmitting
                ? 'جاري الحفظ...'
                : 'حفظ التعديلات'}
            </button>

          </div>

        </div>
      </div>
    </>
  )
}