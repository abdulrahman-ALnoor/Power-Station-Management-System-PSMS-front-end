import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { serviceRequestService } from '@/services/shared/serviceRequestService'
import { ServiceRequest, ServiceRequestFormData } from '../types'
import { useLanguage } from '@/hooks/useLanguage'

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
  const [rawMetersList, setRawMetersList] = useState<{ id: number; meter_number: string; status?: string; installation_location?: string }[]>([])

  const [isCustomersLoading, setIsCustomersLoading] = useState(false)
  const [customersError, setCustomersError] = useState<string | null>(null)

  const [isMetersLoading, setIsMetersLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load customers on open
  useEffect(() => {
    if (isOpen) {
      setIsCustomersLoading(true)
      setCustomersError(null)
      serviceRequestService.getCustomers()
        .then(data => {
          setCustomers(data.map(c => ({ label: c.full_name, value: String(c.id) })))
        })
        .catch(() => {
          setCustomersError('تعذر تحميل العملاء، يرجى المحاولة مرة أخرى.')
        })
        .finally(() => {
          setIsCustomersLoading(false)
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
        setRawMetersList([])
      }
      setError(null)
    }
  }, [isOpen, requestToEdit])

  // Load meters when customer changes
  useEffect(() => {
    if (formData.customer_id) {
      setIsMetersLoading(true)
      serviceRequestService.getMetersByCustomer(Number(formData.customer_id))
        .then(data => {
          setRawMetersList(data)
          setMeters(data.map(m => ({ label: m.meter_number, value: String(m.id) })))
          if (!data.find(m => String(m.id) === String(formData.meter_id))) {
            setFormData(prev => ({ ...prev, meter_id: '' }))
          }
        })
        .catch(() => {
          setRawMetersList([])
          setMeters([])
          setFormData(prev => ({ ...prev, meter_id: '' }))
        })
        .finally(() => {
          setIsMetersLoading(false)
        })
    } else {
      setRawMetersList([])
      setMeters([])
      setFormData(prev => ({ ...prev, meter_id: '' }))
    }
  }, [formData.customer_id])

  if (!isOpen) return null

  const selectedMeter = rawMetersList.find(m => String(m.id) === String(formData.meter_id))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (!formData.customer_id || !formData.meter_id || !formData.request_type) {
        throw new Error('يرجى تعبئة الحقول المطلوبة (العميل، العداد، نوع الطلب)')
      }

      if (requestToEdit) {
        await serviceRequestService.updateServiceRequest(requestToEdit.id, formData)
      } else {
        await serviceRequestService.createServiceRequest(formData)
      }
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'فشل في حفظ طلب الخدمة')
    } finally {
      setIsSubmitting(false)
    }
  }

  const modalTitle = requestToEdit ? 'تعديل طلب خدمة' : 'إضافة طلب خدمة'
  const submitText = requestToEdit ? 'حفظ التعديلات' : 'إنشاء الطلب'

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
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm font-medium">
                  {error}
                </div>
              )}

              {customersError && (
                <div className="bg-amber-50 text-amber-700 p-4 rounded-xl border border-amber-200 text-sm flex justify-between items-center">
                  <span>{customersError}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsCustomersLoading(true)
                      setCustomersError(null)
                      serviceRequestService.getCustomers()
                        .then(data => setCustomers(data.map(c => ({ label: c.full_name, value: String(c.id) }))))
                        .catch(() => setCustomersError('تعذر تحميل العملاء، يرجى المحاولة مرة أخرى.'))
                        .finally(() => setIsCustomersLoading(false))
                    }}
                  >
                    إعادة المحاولة
                  </Button>
                </div>
              )}

              {/* Section 1: Customer & Meter */}
              <section className="space-y-4">
                <h4 className="font-bold text-primary border-b border-border pb-2">
                  بيانات العميل والعداد
                </h4>

                <div className="grid grid-cols-1 gap-5">
                  <Select
                    label="العميل *"
                    required
                    disabled={isCustomersLoading}
                    value={formData.customer_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customer_id: e.target.value ? Number(e.target.value) : '',
                      })
                    }
                    options={customers}
                    placeholder={
                      isCustomersLoading
                        ? 'جاري تحميل العملاء...'
                        : (customers.length === 0 ? 'لا يوجد عملاء متاحون' : 'اختر العميل...')
                    }
                    fullWidth
                  />

                  <Select
                    label="العداد *"
                    required
                    disabled={!formData.customer_id || isMetersLoading}
                    value={formData.meter_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        meter_id: e.target.value ? Number(e.target.value) : '',
                      })
                    }
                    options={meters}
                    placeholder={
                      !formData.customer_id
                        ? 'يرجى اختيار العميل أولاً'
                        : (isMetersLoading
                            ? 'جاري تحميل العدادات...'
                            : (meters.length === 0
                                ? 'لا توجد عدادات مرتبطة بهذا العميل'
                                : 'اختر العداد'))
                    }
                    fullWidth
                  />

                  {/* Selected Meter Info Card */}
                  {selectedMeter && (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800">رقم العداد:</span>
                        <span className="font-mono text-primary font-bold">{selectedMeter.meter_number}</span>
                      </div>
                      {selectedMeter.installation_location && (
                        <div className="flex justify-between items-center text-xs text-gray-600">
                          <span>موقع التركيب:</span>
                          <span>{selectedMeter.installation_location}</span>
                        </div>
                      )}
                      {selectedMeter.status && (
                        <div className="flex justify-between items-center text-xs text-gray-600">
                          <span>حالة العداد:</span>
                          <span className="font-semibold text-green-700">{selectedMeter.status === 'active' ? 'نشط' : selectedMeter.status}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>

              {/* Section 2: Request Details */}
              <section className="space-y-4">
                <h4 className="font-bold text-primary border-b border-border pb-2">
                  تفاصيل الطلب
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Select
                    label="نوع الطلب *"
                    required
                    value={formData.request_type}
                    onChange={(e) => setFormData({ ...formData, request_type: e.target.value as any })}
                    options={[
                      { label: 'توصيل جديد', value: 'new_connection' },
                      { label: 'صيانة', value: 'maintenance' },
                      { label: 'فصل الخدمة', value: 'disconnection' },
                    ]}
                    placeholder="اختر نوع الطلب"
                    fullWidth
                  />

                  <Select
                    label="الأولوية"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    options={[
                      { label: 'منخفضة', value: 'low' },
                      { label: 'متوسطة', value: 'medium' },
                      { label: 'عالية', value: 'high' },
                      { label: 'طارئة', value: 'emergency' },
                    ]}
                    placeholder="اختر الأولوية"
                    fullWidth
                  />
                </div>

                <div className="space-y-2 mt-4">
                  <label className="block font-semibold text-[var(--text-label)] text-text tracking-wide">
                    الوصف
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="اكتب وصفاً مختصراً لسبب طلب الخدمة..."
                    className="w-full p-3 bg-surface rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-text transition-all resize-none"
                  />
                </div>
              </section>

            </form>
          </div>

          {/* Footer */}
          <div className="border-t border-border p-6 flex justify-end gap-3 shrink-0 bg-surface-low rounded-b-2xl">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              إلغاء
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
