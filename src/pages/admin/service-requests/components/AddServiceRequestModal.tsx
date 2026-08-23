import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Headset } from 'lucide-react'
//import { useEffect } from 'react'
import { fetchCustomers, type CustomerApiRecord } from '@/services/customers.service'

import { useLanguage } from '@/hooks/useLanguage'
import { fetchMeterList, type MeterApiRecord } from '@/services/meters.service'
import { createServiceRequest } from '@/services/serviceRequests.service'
import { showSuccess, showError } from '@/utils/toast'

export interface ServiceRequestData {
  meter_id: string
  customer_id: string
  assigned_engineer_id?: string
  request_type: 'new_connection' | 'maintenance' | 'disconnection'
  priority: 'low' | 'medium' | 'high' | 'emergency'
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
  description?: string
}

interface AddServiceRequestModalProps {
 isOpen: boolean
 onClose: () => void
 onAdd?: (data: ServiceRequestData) => void
}

const initialFormData: ServiceRequestData = {
  meter_id: '',
  customer_id: '',
  request_type: 'new_connection',
  priority: 'medium',
  status: 'pending',
  description: '',
}

export function AddServiceRequestModal({
  isOpen,
  onClose,
  onAdd,
}: AddServiceRequestModalProps) {
  const { t } = useTranslation('serviceRequests')
  const { isRTL } = useLanguage()

  const [formData, setFormData] = useState<ServiceRequestData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
const [customers, setCustomers] = useState<CustomerApiRecord[]>([])
const [isLoadingCustomers, setIsLoadingCustomers] = useState(false)

const [meters, setMeters] = useState<MeterApiRecord[]>([])
const [isLoadingMeters, setIsLoadingMeters] = useState(false)


useEffect(() => {
  if (!isOpen) return

  const loadCustomers = async () => {
    setIsLoadingCustomers(true)

    try {
      const data = await fetchCustomers()
      setCustomers(data)
    } catch (err) {
      console.error('Failed to load customers:', err)
    } finally {
      setIsLoadingCustomers(false)
    }
  }

  loadCustomers()
}, [isOpen])

useEffect(() => {
  if (!isOpen) return

  const loadMeters = async () => {
    setIsLoadingMeters(true)

    try {
      const response = await fetchMeterList()
      setMeters(response.data)
    } catch (err) {
      console.error('Failed to load meters:', err)
    } finally {
      setIsLoadingMeters(false)
    }
  }

  loadMeters()
}, [isOpen])


const filteredMeters = meters.filter(
  (meter) => meter.customer?.id === Number(formData.customer_id),
)

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!formData.customer_id || !formData.meter_id) {
      setError('العميل والعداد مطلوبان.')
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        meter_id: Number(formData.meter_id),
        customer_id: Number(formData.customer_id),
        request_type: formData.request_type,
        priority: formData.priority,
        description: formData.description?.trim() || undefined,
      }

      await createServiceRequest(payload)

      showSuccess('طلب الخدمة')

      onAdd?.(formData)

      setFormData(initialFormData)
      onClose()
    } catch (err) {
      const apiError = err as {
        message?: string
        response?: {
          data?: {
            message?: string
          }
        }
      }

      const message =
        apiError?.response?.data?.message ||
        apiError?.message ||
        'تعذر إنشاء طلب الخدمة.'

      setError(message)
      showError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (isSubmitting) return

    setError(null)
    setFormData(initialFormData)
    onClose()
  }

 if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/45 z-40 transition-opacity"
        onClick={handleClose}
      />

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="bg-white dark:bg-surface-container-low w-full max-w-2xl rounded-2xl shadow-2xl border border-outline/10 flex flex-col max-h-[calc(100vh-32px)] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-outline/10">
            <div>
              <h2 className="font-headline-sm text-xl font-semibold text-on-surface dark:text-on-dark flex items-center gap-2">
                <Headset size={20} className="text-primary" />
                {t('addModal.title')}
              </h2>

              <p className="text-sm text-outline dark:text-outline/80 mt-2">
                {t('addModal.description')}
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              aria-label={t('addModal.actions.cancel')}
              className="p-2 rounded-full hover:bg-surface-variant dark:hover:bg-surface-container transition-colors text-outline self-start mt-[-4px] disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <form
              id="add-request-form"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {error && (
                <div className="p-3 rounded-lg bg-error/10 text-error text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                    {t('addModal.fields.customer')}{' '}
                    <span className="text-error">*</span>
                  </label>

                  <select
                    required
                    name="customer_id"
                    value={formData.customer_id}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full bg-surface-container-lowest dark:bg-surface-container/30 border border-outline/20 dark:border-outline/10 text-on-surface dark:text-on-dark text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow cursor-pointer disabled:opacity-60"
                  >
                    <option value="" disabled>
                      Select Customer
                    </option>
                   <option value="" disabled>
  {isLoadingCustomers ? 'جاري تحميل العملاء...' : 'اختر العميل'}
</option>

        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.customer_number
              ? `${customer.customer_number} - ${customer.full_name}`
              : customer.full_name}
          </option>
        ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                    {t('addModal.fields.meter')}{' '}
                    <span className="text-error">*</span>
                  </label>

                  <select
                    required
                    name="meter_id"
                    value={formData.meter_id}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full bg-surface-container-lowest dark:bg-surface-container/30 border border-outline/20 dark:border-outline/10 text-on-surface dark:text-on-dark text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow cursor-pointer disabled:opacity-60"
                  >
                    <option value="" disabled>
                      Select Meter
                    </option>
                   <option value="" disabled>
  {isLoadingMeters
    ? 'جاري تحميل العدادات...'
    : !formData.customer_id
      ? 'اختر العميل أولاً'
      : filteredMeters.length === 0
        ? 'لا توجد عدادات لهذا العميل'
        : 'اختر العداد'}
</option>

{filteredMeters.map((meter) => (
  <option key={meter.id} value={meter.id}>
    {meter.meter_number}
  </option>
))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                    {t('addModal.fields.requestType')}{' '}
                    <span className="text-error">*</span>
                  </label>

                  <select
                    required
                    name="request_type"
                    value={formData.request_type}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full bg-surface-container-lowest dark:bg-surface-container/30 border border-outline/20 dark:border-outline/10 text-on-surface dark:text-on-dark text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow cursor-pointer disabled:opacity-60"
                  >
                    <option value="new_connection">
                      {t('addModal.requestTypes.new_connection')}
                    </option>
                    <option value="maintenance">
                      {t('addModal.requestTypes.maintenance')}
                    </option>
                    <option value="disconnection">
                      {t('addModal.requestTypes.disconnection')}
                    </option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                    {t('addModal.fields.priority')}{' '}
                    <span className="text-error">*</span>
                  </label>

                  <select
                    required
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full bg-surface-container-lowest dark:bg-surface-container/30 border border-outline/20 dark:border-outline/10 text-on-surface dark:text-on-dark text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow cursor-pointer disabled:opacity-60"
                  >
                    <option value="low">
                      {t('addModal.priorities.low')}
                    </option>
                    <option value="medium">
                      {t('addModal.priorities.medium')}
                    </option>
                    <option value="high">
                      {t('addModal.priorities.high')}
                    </option>
                    <option value="emergency">
                      {t('addModal.priorities.emergency')}
                    </option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                    {t('addModal.fields.description')}
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    rows={4}
                    className="w-full min-h-[100px] bg-surface-container-lowest dark:bg-surface-container/30 border border-outline/20 dark:border-outline/10 text-on-surface dark:text-on-dark text-sm rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow resize-none disabled:opacity-60"
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="p-6 pt-4 mt-2 border-t border-outline/10 bg-surface-white dark:bg-surface-container-low flex flex-col sm:flex-row items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-outline/20 text-on-surface dark:text-on-dark font-semibold hover:bg-surface-variant dark:hover:bg-surface-container transition-colors min-h-[44px] disabled:opacity-60"
            >
              {t('addModal.actions.cancel')}
            </button>

            <button
              type="submit"
              form="add-request-form"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary-dark transition-colors shadow-sm min-h-[44px] disabled:opacity-60"
            >
              {isSubmitting ? '...' : t('addModal.actions.add')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
