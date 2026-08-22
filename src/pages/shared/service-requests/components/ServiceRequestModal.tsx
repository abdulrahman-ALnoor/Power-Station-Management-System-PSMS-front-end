import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { serviceRequestService } from '@/services/shared/serviceRequestService'
import { ServiceRequest, ServiceRequestFormData } from '../types'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'

interface ServiceRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  requestToEdit?: ServiceRequest
}

interface Option {
  label: string
  value: string
}

export function ServiceRequestModal({ isOpen, onClose, onSuccess, requestToEdit }: ServiceRequestModalProps) {
  const { t } = useTranslation('engineer')
  const { isRTL } = useLanguage()

  const [formData, setFormData] = useState<ServiceRequestFormData>({
    customer_id: '',
    meter_id: '',
    request_type: '',
    priority: '',
    description: '',
  })

  const [customers, setCustomers] = useState<Option[]>([])
  const [meters, setMeters] = useState<Option[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load customers on open
  useEffect(() => {
    if (isOpen) {
      serviceRequestService.getCustomers().then(data => {
        setCustomers(data.map(c => ({ label: c.full_name, value: String(c.id) })))
      })
    }
  }, [isOpen])

  // Reset or Populate state
  useEffect(() => {
    if (isOpen) {
      if (requestToEdit) {
        setFormData({
          customer_id: requestToEdit.customer_id,
          meter_id: requestToEdit.meter_id,
          request_type: requestToEdit.request_type,
          priority: requestToEdit.priority ?? '',
          description: requestToEdit.description ?? '',
        })
      } else {
        setFormData({
          customer_id: '',
          meter_id: '',
          request_type: '',
          priority: '',
          description: '',
        })
        setMeters([])
      }
      setError(null)
    }
  }, [isOpen, requestToEdit])

  // Load meters when customer changes
  useEffect(() => {
    if (formData.customer_id) {
      serviceRequestService.getMetersByCustomer(Number(formData.customer_id)).then(data => {
        setMeters(data.map(m => ({ label: m.meter_number, value: String(m.id) })))
        // Reset meter selection if it doesn't belong to new customer
        if (!data.find(m => String(m.id) === String(formData.meter_id))) {
          if (!requestToEdit || requestToEdit.customer_id !== Number(formData.customer_id)) {
            setFormData(prev => ({ ...prev, meter_id: '' }))
          }
        }
      })
    } else {
      setMeters([])
      setFormData(prev => ({ ...prev, meter_id: '' }))
    }
  }, [formData.customer_id, requestToEdit])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (!formData.customer_id || !formData.meter_id || !formData.request_type) {
        throw new Error(t('serviceRequests.createModal.errors.requiredFields', 'يرجى تعبئة الحقول المطلوبة'))
      }

      if (requestToEdit) {
        await serviceRequestService.updateServiceRequest(requestToEdit.id, formData)
      } else {
        await serviceRequestService.createServiceRequest(formData)
      }
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || t('serviceRequests.createModal.errors.submissionFailed', 'فشل في حفظ الطلب'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const modalTitle = requestToEdit 
    ? t('serviceRequests.createModal.editTitle', 'تعديل طلب خدمة') 
    : t('serviceRequests.createModal.title', 'إضافة طلب خدمة')
  const submitText = requestToEdit 
    ? t('serviceRequests.createModal.actions.save', 'حفظ التعديلات') 
    : t('serviceRequests.createModal.actions.submit', 'إضافة الطلب')

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          zIndex: 0,
        }}
        onClick={onClose}
      />

      {/* Modal Wrapper */}
      <div
        className="fixed inset-0 flex items-center justify-center p-6"
        style={{
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        {/* Modal Panel */}
        <div
          className="relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-y-auto max-h-[calc(100vh-48px)] flex flex-col bg-surface text-text"
          style={{ pointerEvents: 'auto' }}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="border-b border-border p-6 flex justify-between items-start shrink-0">
            <div>
              <h3 className="font-headline-md text-headline-md font-bold text-primary">
                {modalTitle}
              </h3>
            </div>
            <button
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-text-muted hover:text-text"
              onClick={onClose}
              type="button"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto">
            <form id="service-request-form" onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-800 text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Section 1: Customer & Meter */}
              <section className="space-y-4">
                <h4 className="font-bold text-primary border-b border-border pb-2">
                  {t('serviceRequests.createModal.sections.customerData', 'بيانات العميل والعداد')}
                </h4>
                
                  <div className="grid grid-cols-1 gap-5">
                    <Select
                      label={t('serviceRequests.createModal.fields.customer', 'العميل')}
                      required
                      value={formData.customer_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customer_id: e.target.value ? Number(e.target.value) : '',
                        })
                      } options={customers}
                      placeholder={t('serviceRequests.createModal.placeholders.selectCustomer', 'اختر العميل')}
                      fullWidth
                    />

                    <Select
                      label={t('serviceRequests.createModal.fields.meter', 'العداد')}
                      required
                      disabled={!formData.customer_id}
                      value={formData.meter_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          meter_id: e.target.value ? Number(e.target.value) : '',
                        })
                      } options={meters}
                      placeholder={!formData.customer_id ? t('serviceRequests.createModal.placeholders.selectCustomerFirst', 'اختر العميل أولاً') : (meters.length === 0 ? t('serviceRequests.createModal.placeholders.noMetersFound', 'لا يوجد عدادات') : t('serviceRequests.createModal.placeholders.selectMeter', 'اختر العداد'))}
                      fullWidth
                    />
                  </div>
              </section>

              {/* Section 2: Request Details */}
              <section className="space-y-4">
                <h4 className="font-bold text-primary border-b border-border pb-2">
                  {t('serviceRequests.createModal.sections.requestDetails', 'تفاصيل الطلب')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Select
                    label={t('serviceRequests.createModal.fields.requestType', 'نوع الطلب')}
                    required
                    value={formData.request_type}
                    onChange={(e) => setFormData({ ...formData, request_type: e.target.value as any })}
                    options={[
                      { label: t('serviceRequests.type.new_connection', 'توصيل جديد'), value: 'new_connection' },
                      { label: t('serviceRequests.type.maintenance', 'صيانة'), value: 'maintenance' },
                      { label: t('serviceRequests.type.disconnection', 'فصل الخدمة'), value: 'disconnection' },
                    ]}
                    placeholder={t('serviceRequests.createModal.placeholders.selectType', 'اختر نوع الطلب')}
                    fullWidth
                  />

                  <Select
                    label={t('serviceRequests.createModal.fields.priority', 'الأولوية')}
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    options={[
                      { label: t('serviceRequests.priority.low', 'منخفضة'), value: 'low' },
                      { label: t('serviceRequests.priority.medium', 'متوسطة'), value: 'medium' },
                      { label: t('serviceRequests.priority.high', 'عالية'), value: 'high' },
                      { label: t('serviceRequests.priority.emergency', 'طارئة'), value: 'emergency' },
                    ]}
                    placeholder={t('serviceRequests.createModal.placeholders.selectPriority', 'اختر الأولوية')}
                    fullWidth
                  />
                </div>

                <div className="space-y-2 mt-4">
                  <label className="block font-semibold text-[var(--text-label)] text-text tracking-wide">
                    {t('serviceRequests.createModal.fields.description', 'الوصف')}
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder={t('serviceRequests.createModal.placeholders.description', 'اكتب وصفاً مختصراً...')}
                    className="w-full p-3 bg-surface rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-text transition-all resize-none"
                  />
                </div>
              </section>

            </form>
          </div>

          {/* Footer */}
          <div className="border-t border-border p-6 flex justify-end gap-3 shrink-0 bg-surface-container-lowest rounded-b-2xl">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t('serviceRequests.createModal.actions.cancel', 'إلغاء')}
            </Button>
            <Button
              type="submit"
              form="service-request-form"
              disabled={isSubmitting}
              className="min-w-[140px]"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                submitText
              )}
            </Button>
          </div>

        </div>
      </div>
    </div>,
    document.body
  )
}
