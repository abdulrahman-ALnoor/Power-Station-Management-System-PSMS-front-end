import { useState, useEffect } from 'react'
import { Wrench, Loader2, CheckCircle2 } from 'lucide-react'
import { Modal } from '@/components/overlays/Modal'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'

import { 
 MockMeterInfo, 
 ServiceRequestType,
 ServiceRequestPriority,
 CreateServiceRequestPayload
} from '../types/readerForms.types'
import { getReaderMeters, submitServiceRequest } from '@/services/readerForms.service'

interface CreateServiceRequestModalProps {
 isOpen: boolean
 onClose: () => void
 onSuccess?: () => void
}

export function CreateServiceRequestModal({ isOpen, onClose, onSuccess }: CreateServiceRequestModalProps) {
 const { isRTL } = useLanguage()

 // Data fetching state
 const [meters, setMeters] = useState<MockMeterInfo[]>([])
 const [isFetchingMeters, setIsFetchingMeters] = useState(false)

 // Form state
 const [selectedMeterId, setSelectedMeterId] = useState<number | ''>('')
 const [requestType, setRequestType] = useState<ServiceRequestType | ''>('')
 const [priority, setPriority] = useState<ServiceRequestPriority>('medium')
 const [description, setDescription] = useState('')

 // Submit states
 const [isSubmitting, setIsSubmitting] = useState(false)
 const [isSuccess, setIsSuccess] = useState(false)

 // Computed / Derived state
 const selectedMeter = meters.find(m => m.id === selectedMeterId)

 // Fetch meters on open
 useEffect(() => {
 if (isOpen) {
 setIsFetchingMeters(true)
 setIsSuccess(false)
 // Reset form
 setSelectedMeterId('')
 setRequestType('')
 setPriority('medium')
 setDescription('')

 getReaderMeters()
 .then(data => setMeters(data))
 .finally(() => setIsFetchingMeters(false))
 }
 }, [isOpen])

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault()
 
 if (isSubmitting || !selectedMeter || !requestType) {
 return
 }

 setIsSubmitting(true)

 const payload: CreateServiceRequestPayload = {
 meter_id: selectedMeter.id,
 customer_id: selectedMeter.customer.id,
 request_type: requestType as ServiceRequestType,
 priority: priority,
 description: description || null
 }

 try {
 await submitServiceRequest(payload)
 setIsSuccess(true)
 setTimeout(() => {
 onClose()
 if (onSuccess) onSuccess()
 }, 1500)
 } catch (err) {
 // Future: Handle API error here via toast or state
 console.error(err)
 } finally {
 setIsSubmitting(false)
 }
 }

 return (
 <Modal 
 open={isOpen} 
 onClose={isSubmitting ? () => {} : onClose}
 size="md"
 closeOnOverlayClick={!isSubmitting}
 >
 {/* Header */}
 <div className="flex items-center gap-3 mb-6 shrink-0 border-b border-border pb-4">
 <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
 <Wrench size={24} />
 </div>
 <div>
 <h2 className="text-headline text-text font-bold">طلب خدمة</h2>
 <p className="text-sm text-text-muted mt-1">
 تقديم طلب صيانة أو خدمة جديدة للعداد.
 </p>
 </div>
 </div>

 {isSuccess ? (
 <div className="flex flex-col items-center justify-center py-12 text-center">
 <CheckCircle2 size={64} className="text-success mb-4" />
 <h3 className="text-headline text-text mb-2">تم الحفظ بنجاح</h3>
 <p className="text-text-muted">تم إرسال طلب الخدمة إلى النظام.</p>
 </div>
 ) : (
 <form id="service-request-form" onSubmit={handleSubmit} className="space-y-6">
 
 {/* Section 1: Meter Selection */}
 <div className="space-y-4">
 <h3 className="text-sm font-semibold text-primary">العداد والعميل</h3>
 
 <div className="space-y-2">
 <label className="block text-sm font-medium text-text">
 اختر العداد <span className="text-danger">*</span>
 </label>
 
 <div className="relative">
 <select
 required
 disabled={isFetchingMeters || isSubmitting}
 value={selectedMeterId}
 onChange={(e) => setSelectedMeterId(Number(e.target.value))}
 className={cn(
 "w-full bg-surface-low border border-border text-text text-sm rounded-lg min-h-[44px] py-2.5 px-4",
 "focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow cursor-pointer appearance-none disabled:opacity-50"
 )}
 >
 <option value="" disabled>
 {isFetchingMeters ? 'جاري تحميل العدادات...' : 'بحث واختيار عداد...'}
 </option>
 {meters.map(meter => (
 <option key={meter.id} value={meter.id}>
 {meter.meterNumber} - {meter.customer.name}
 </option>
 ))}
 </select>
 {isFetchingMeters && (
 <div className="absolute top-1/2 -translate-y-1/2 end-3">
 <Loader2 size={16} className="text-text-muted animate-spin" />
 </div>
 )}
 </div>
 </div>

 {selectedMeter && (
 <div className="bg-surface-container rounded-lg p-3 text-sm">
 <div className="grid grid-cols-2 gap-2">
 <div className="text-text-muted">رقم العداد:</div>
 <div className="text-text font-medium text-end">{selectedMeter.meterNumber}</div>
 
 <div className="text-text-muted">العميل المرتبط:</div>
 <div className="text-text font-medium text-end">{selectedMeter.customer.name}</div>
 
 <div className="text-text-muted">رقم التواصل:</div>
 <div className="text-text font-medium text-end" dir="ltr">{selectedMeter.customer.phone}</div>
 </div>
 </div>
 )}
 </div>

 {/* Section 2: Request Details */}
 {selectedMeter && (
 <div className="space-y-4 pt-6 border-t border-border">
 <h3 className="text-sm font-semibold text-primary">تفاصيل الطلب</h3>
 
 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
 
 <div className="space-y-2">
 <label className="block text-sm font-medium text-text">
 نوع طلب الخدمة <span className="text-danger">*</span>
 </label>
 <select
 required
 disabled={isSubmitting}
 value={requestType}
 onChange={(e) => setRequestType(e.target.value as ServiceRequestType)}
 className="w-full bg-surface border border-border text-text text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow cursor-pointer appearance-none"
 >
 <option value="" disabled>اختر النوع...</option>
 <option value="new_connection">اتصال جديد</option>
 <option value="maintenance">صيانة</option>
 <option value="disconnection">فصل الخدمة</option>
 </select>
 </div>

 <div className="space-y-2">
 <label className="block text-sm font-medium text-text">
 الأولوية <span className="text-danger">*</span>
 </label>
 <select
 required
 disabled={isSubmitting}
 value={priority}
 onChange={(e) => setPriority(e.target.value as ServiceRequestPriority)}
 className="w-full bg-surface border border-border text-text text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow cursor-pointer appearance-none"
 >
 <option value="low">منخفضة</option>
 <option value="medium">متوسطة</option>
 <option value="high">عالية</option>
 <option value="emergency">طارئة</option>
 </select>
 </div>

 <div className="space-y-2 md:col-span-2">
 <label className="block text-sm font-medium text-text">
 وصف الطلب
 </label>
 <textarea
 disabled={isSubmitting}
 value={description}
 onChange={(e) => setDescription(e.target.value)}
 rows={4}
 placeholder="اكتب تفاصيل الخدمة المطلوبة هنا..."
 className="w-full bg-surface border border-border text-text text-sm rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow resize-none"
 />
 </div>
 </div>
 </div>
 )}

 {/* Footer Actions */}
 <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-end gap-3 shrink-0">
 <button
 type="button"
 disabled={isSubmitting}
 onClick={onClose}
 className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-border text-text font-semibold hover:bg-surface-low transition-colors min-h-[44px]"
 >
 إلغاء
 </button>
 <button
 type="submit"
 form="service-request-form"
 disabled={isSubmitting || !selectedMeter || !requestType}
 className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px]"
 >
 {isSubmitting && <Loader2 size={18} className="animate-spin" />}
 إرسال طلب الخدمة
 </button>
 </div>
 </form>
 )}
 </Modal>
 )
}
