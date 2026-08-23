import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'
import { X, Search } from 'lucide-react'
import { createMeter, updateMeter } from '@/services/meters.service'
import { fetchCustomers, type CustomerApiRecord } from '@/services/customers.service'
import { fetchEmployees, mapEmployee } from '@/services/employees.service'
import type { Employee } from '@/pages/admin/employees/types'
import type { Meter, MeterStatus, CreateMeterPayload } from '../types'
import type { ApiError } from '@/types/api'

import {
  showSuccess,
  showError,
} from '@/utils/toast'

interface AddMeterModalProps {
  isOpen: boolean
  onClose: () => void
  onSaved?: () => void
  /** When provided, the modal edits this meter instead of creating a new one. */
  meter?: Meter | null
}

export function AddMeterModal({ isOpen, onClose, onSaved, meter }: AddMeterModalProps) {
  const { t } = useTranslation('meters')
  const isEditMode = Boolean(meter)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customers, setCustomers] = useState<CustomerApiRecord[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])

  useEffect(() => {
    if (!isOpen) return
    setError(null)
    fetchCustomers()
      .then(setCustomers)
      .catch(() => setCustomers([]))
    fetchEmployees({ per_page: 100 })
      .then((res) => setEmployees(res.data.map(mapEmployee)))
      .catch(() => setEmployees([]))
  }, [isOpen])

 if (!isOpen) return null

 const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>,
) => {
  e.preventDefault()

  setError(null)

  const formElement =
    e.currentTarget

  const form =
    new FormData(formElement)

  const customerIdRaw =
    String(
      form.get('customer_id') || '',
    )

  const installedByRaw =
    String(
      form.get('installed_by') || '',
    )

  const payload: CreateMeterPayload = {
    customer_id:
      Number(customerIdRaw),

    meter_number:
      String(
        form.get('meter_number') || '',
      ),

    installation_date:
      String(
        form.get('installation_date') || '',
      ) || null,

    installation_location:
      String(
        form.get('installation_location') || '',
      ) || null,

    status:
      (form.get('status') as MeterStatus)
      || 'active',

    installed_by:
      Number(installedByRaw),
  }

  setIsSubmitting(true)

  try {

    // ============================
    // تعديل العداد
    // ============================

    if (
      isEditMode &&
      meter
    ) {
      await updateMeter(
        meter.id,
        payload,
      )
    }

    // ============================
    // إضافة عداد جديد
    // ============================

    else {
      await createMeter(
        payload,
      )
    }

    // تحديث جدول العدادات
    onSaved?.()

    // إعادة تعيين النموذج
    formElement.reset()

    // إغلاق النافذة
    onClose()

    // رسالة النجاح
    showSuccess(
      isEditMode
        ? 'تم تحديث بيانات العداد بنجاح.'
        : 'تم إضافة العداد بنجاح.',

      isEditMode
        ? 'تم التعديل بنجاح'
        : 'تمت الإضافة بنجاح',
    )

  } catch (err) {

    const apiError =
      err as ApiError

    const validationMessage =
      apiError.errors
        ? Object.values(
            apiError.errors,
          )
            .flat()
            .join(' ')
        : undefined

    const errorMessage =
      validationMessage ||
      apiError?.message ||
      t('errors.saveFailed')

    // إظهار الخطأ داخل النموذج
    setError(errorMessage)

    // رسالة الخطأ العامة
    showError(
      errorMessage,
      isEditMode
        ? 'فشل تعديل العداد'
        : 'فشل إضافة العداد',
    )

  } finally {

    setIsSubmitting(false)

  }
}



  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          zIndex: 9998,
        }}
        onClick={onClose}
      />

      {/* Modal Wrapper */}
      <div
        className="fixed inset-0 flex items-center justify-center p-6"
        style={{
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      >
        {/* Modal Panel */}
        <div
          className="relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-y-auto max-h-[calc(100vh-48px)] flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          style={{
            pointerEvents: 'auto',
          }}
        >
          {/* Header */}
          <div className="border-b border-slate-200 dark:border-slate-700 p-6 flex justify-between items-start shrink-0">
            <div>
              <h3 className="font-headline-md text-headline-md font-bold text-primary dark:text-white">
                {isEditMode ? t('modal.editTitle') : t('modal.addTitle')}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                {t('modal.subtitle')}
              </p>
            </div>
            <button
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400"
              onClick={onClose}
              type="button"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto">
            <form
              key={meter?.id ?? 'new'}
              className="p-6 md:p-8 space-y-8"
              onSubmit={handleSubmit}
            >
              {error && (
                <div className="p-3 rounded-lg bg-error/10 text-error text-sm">{error}</div>
              )}

              {/* Section 1: Meter Information */}
              <section className="space-y-4">
                <h4 className="font-bold text-primary dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                  {t('modal.sectionMeter')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block font-medium text-sm text-slate-800 dark:text-slate-200">
                      {t('modal.meterNumber')} <span className="text-error">*</span>
                    </label>
                    <input
                      name="meter_number"
                      type="text"
                      required
                      defaultValue={meter?.meter_number ?? ''}
                      placeholder="MT-000000"
                      className="w-full px-4 h-11 bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block font-medium text-sm text-slate-800 dark:text-slate-200">
                      {t('modal.searchCustomer')} <span className="text-error">*</span>
                    </label>
                    <select
                      name="customer_id"
                      required
                      defaultValue={meter?.customer_id ?? ''}
                      className="w-full px-4 h-11 bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-slate-900 dark:text-white transition-all cursor-pointer"
                    >
                      <option value="" disabled>{t('modal.selectCustomerPlaceholder')}</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>{c.full_name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* Section 2: Installation Information */}
              <section className="space-y-4">
                <h4 className="font-bold text-primary dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                  {t('modal.sectionInstallation')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block font-medium text-sm text-slate-800 dark:text-slate-200">
                      {t('modal.installationDate')}
                    </label>
                    <input
                      name="installation_date"
                      type="date"
                      defaultValue={meter?.installation_date ?? ''}
                      className="w-full px-4 h-11 bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-medium text-sm text-slate-800 dark:text-slate-200">
                      {t('modal.installedBy')} <span className="text-error">*</span>
                    </label>
                    <select
                      name="installed_by"
                      required
                      defaultValue={meter?.installed_by ?? ''}
                      className="w-full px-4 h-11 bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-slate-900 dark:text-white transition-all cursor-pointer"
                    >
                      <option value="" disabled>{t('modal.selectInstalledByPlaceholder')}</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block font-medium text-sm text-slate-800 dark:text-slate-200">
                      {t('modal.installationLocation')}
                    </label>
                    <textarea
                      name="installation_location"
                      rows={3}
                      defaultValue={meter?.installation_location ?? ''}
                      className="w-full px-4 py-3 min-h-[100px] bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white resize-none"
                    />
                  </div>
                </div>
              </section>

              {/* Section 3: Status */}
              <section className="space-y-4">
                <h4 className="font-bold text-primary dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                  {t('modal.sectionStatus')}
                </h4>
                <div className="space-y-2 md:w-1/2">
                  <label className="block font-medium text-sm text-slate-800 dark:text-slate-200">
                    {t('modal.status')} <span className="text-error">*</span>
                  </label>
                  <select
                    name="status"
                    required
                    defaultValue={meter?.status ?? 'active'}
                    className="w-full px-4 h-11 bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none cursor-pointer text-slate-900 dark:text-white"
                  >
                    <option value="active">{t('status.active')}</option>
                    <option value="disconnected">{t('status.disconnected')}</option>
                    <option value="maintenance">{t('status.maintenance')}</option>
                    <option value="damaged">{t('status.damaged')}</option>
                  </select>
                </div>
              </section>

              {/* Actions */}
              <div className="flex gap-4 pt-6 border-t border-slate-200 dark:border-slate-700 mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-12 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 shadow-md active:scale-95 transition-all disabled:opacity-60"
                >
                  {isSubmitting ? t('modal.saving') : (isEditMode ? t('modal.confirmEdit') : t('modal.confirmAdd'))}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-12 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
                >
                  {t('modal.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
