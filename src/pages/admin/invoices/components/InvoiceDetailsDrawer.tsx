import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Calendar } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { Invoice } from '../types'
import { formatCurrency } from '@/utils/currency'
import { cn } from '@/utils/cn'

interface InvoiceDetailsDrawerProps {
  invoice: Invoice | null
  isOpen: boolean
  onClose: () => void
}

export function InvoiceDetailsDrawer({
  invoice,
  isOpen,
  onClose,
}: InvoiceDetailsDrawerProps) {
  const { t } = useTranslation('invoices')
  const { isRTL } = useLanguage()
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
    } else {
      const timer = setTimeout(
        () => setShouldRender(false),
        300,
      )

      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!shouldRender || !invoice) return null

  const getStatusStyle = (
    status: string | null,
  ) => {
    switch (status) {
      case 'paid':
        return 'bg-green-50 text-green-600'

      case 'partially_paid':
        return 'bg-amber-50 text-amber-600'

      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const formatDate = (
    dateString: string,
  ) => {
    return new Date(
      dateString,
    ).toLocaleDateString(
      isRTL ? 'ar-SA' : 'en-US',
    )
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-[70] flex items-center justify-center p-4 transition-opacity duration-300',
        isOpen
          ? 'opacity-100'
          : 'opacity-0 pointer-events-none',
      )}
    >
      {/* الخلفية */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* نافذة تفاصيل الفاتورة */}
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className={cn(
          'relative z-10 flex w-full max-w-2xl max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300',
          isOpen
            ? 'scale-100 translate-y-0 opacity-100'
            : 'scale-95 translate-y-4 opacity-0',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white p-6">
          <h3 className="font-headline-md font-bold text-gray-900">
            {t('drawer.title')}
          </h3>

          <button
            type="button"
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            onClick={onClose}
            aria-label={t('drawer.close')}
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto bg-white p-6 space-y-8">

          <div className="space-y-4">

            <div className="flex items-center justify-between">
              <h4 className="font-headline-md font-bold text-gray-900">
                {invoice.invoice_number}
              </h4>

              <span
                className={cn(
                  'rounded-full px-3 py-1 text-[12px] font-bold shadow-sm',
                  getStatusStyle(invoice.status),
                )}
              >
                {invoice.status
                  ? t(`status.${invoice.status}`)
                  : t('status.unspecified')}
              </span>
            </div>

            {/* المبالغ */}
            <div className="space-y-4 rounded-xl bg-gray-50 p-4 border border-gray-200">

              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <span className="text-label-md text-gray-500">
                  {t('drawer.outstandingBeforePayment')}
                </span>

                <span
                  className="font-bold text-gray-900"
                  dir="ltr"
                >
                  {formatCurrency(
                    invoice.outstanding_before_payment,
                    isRTL,
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <span className="text-label-md text-gray-500">
                  {t('drawer.paidAmount')}
                </span>

                <span
                  className="font-bold text-green-600"
                  dir="ltr"
                >
                  {formatCurrency(
                    invoice.paid_amount,
                    isRTL,
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-label-md text-gray-500">
                  {t('drawer.remainingBalance')}
                </span>

                <span
                  className="font-bold text-amber-600"
                  dir="ltr"
                >
                  {formatCurrency(
                    invoice.remaining_balance,
                    isRTL,
                  )}
                </span>
              </div>

            </div>

            {/* معلومات إضافية */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="mb-1 text-label-sm text-gray-500">
                  {t('drawer.customerName')}
                </p>

                <p className="font-bold text-gray-900">
                  {invoice.customer?.name || '-'}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="mb-1 text-label-sm text-gray-500">
                  {t('drawer.accountant')}
                </p>

                <p className="font-bold text-gray-900">
                  {invoice.accountant?.name || '-'}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="mb-1 text-label-sm text-gray-500">
                  {t('drawer.createdAt')}
                </p>

                <p className="flex items-center gap-2 font-bold text-gray-900">
                  <Calendar
                    size={16}
                    className="text-gray-400"
                  />

                  <span dir="ltr">
                    {formatDate(
                      invoice.created_at,
                    )}
                  </span>
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="mb-1 text-label-sm text-gray-500">
                  {t('drawer.updatedAt')}
                </p>

                <p className="flex items-center gap-2 font-bold text-gray-900">
                  <Calendar
                    size={16}
                    className="text-gray-400"
                  />

                  <span dir="ltr">
                    {formatDate(
                      invoice.updated_at,
                    )}
                  </span>
                </p>
              </div>

            </div>

          </div>

          {/* Notes */}
          <div className="space-y-4">

            <h5 className="border-b border-gray-200 pb-2 font-body-md font-bold text-gray-900">
              {t('drawer.paymentNotes')}
            </h5>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

              {invoice.payment_notes ? (
                <p className="whitespace-pre-wrap leading-relaxed text-gray-700">
                  {invoice.payment_notes}
                </p>
              ) : (
                <p className="italic text-gray-400">
                  {t('drawer.noNotes')}
                </p>
              )}

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-gray-200 bg-white p-6">

          <button
            type="button"
            className="w-full rounded-xl bg-primary py-3 font-bold text-on-primary transition-colors hover:bg-primary/90"
          >
            {t('drawer.editData')}
          </button>

        </div>

      </div>
    </div>
  )
}