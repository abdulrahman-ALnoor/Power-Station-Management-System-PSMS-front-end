import { createPortal } from 'react-dom'
import { ServiceRequest } from '../types'
import { ServiceRequestStatusBadge } from './ServiceRequestStatusBadge'
import { ServiceRequestPriorityBadge } from './ServiceRequestPriorityBadge'
import { useLanguage } from '@/hooks/useLanguage'

interface ServiceRequestDetailsDrawerProps {
 request: ServiceRequest
 onClose: () => void
}

export function ServiceRequestDetailsDrawer({ request, onClose }: ServiceRequestDetailsDrawerProps) {
 const { isRTL } = useLanguage()
 
 if (!request) return null

 const getRequestType = (type: string) => {
 switch (type) {
 case 'new_connection': return 'توصيلة جديدة'
 case 'maintenance': return 'صيانة'
 case 'disconnection': return 'فصل الخدمة'
 default: return type
 }
 }

 return createPortal(
 <div
 className="fixed inset-0 z-[999999]"
 style={{ direction: isRTL ? 'rtl' : 'ltr' }}
 >
 <div
 onClick={onClose}
 className="absolute inset-0 bg-black/45 dark:bg-black/60"
 />

 <div
 onClick={(e) => e.stopPropagation()}
 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(720px,calc(100vw-32px))] max-h-[calc(100vh-32px)] overflow-y-auto bg-surface rounded-2xl shadow-2xl z-[1000000]"
 >
 <div className="p-6">
 {/* Header */}
 <div className="flex justify-between items-center mb-6 pb-4 border-b border-border dark:border-border-subtle">
 <h2 className="m-0 text-2xl font-bold text-text-primary">تفاصيل الطلب</h2>
 <button 
 type="button" 
 onClick={onClose}
 className="bg-transparent border-none text-2xl cursor-pointer text-text-muted hover:text-text-primary dark:text-text-secondary dark:hover:text-text-primary transition-colors"
 >
 ✕
 </button>
 </div>

 {/* Details Content */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
 
 <div className="bg-surface-low dark:bg-surface-elevated p-4 rounded-lg border border-transparent dark:border-border-subtle">
 <div className="text-sm text-text-muted dark:text-text-secondary mb-1">رقم الطلب</div>
 <div className="font-medium text-text-primary">REQ-#{request.id}</div>
 </div>

 <div className="bg-surface-low dark:bg-surface-elevated p-4 rounded-lg border border-transparent dark:border-border-subtle">
 <div className="text-sm text-text-muted dark:text-text-secondary mb-1">العميل</div>
 <div className="font-medium text-text-primary">{request.customer?.full_name || '-'}</div>
 </div>

 <div className="bg-surface-low dark:bg-surface-elevated p-4 rounded-lg border border-transparent dark:border-border-subtle">
 <div className="text-sm text-text-muted dark:text-text-secondary mb-1">رقم العداد</div>
 <div className="font-medium text-text-primary">{request.meter?.meter_number || '-'}</div>
 </div>

 <div className="bg-surface-low dark:bg-surface-elevated p-4 rounded-lg border border-transparent dark:border-border-subtle">
 <div className="text-sm text-text-muted dark:text-text-secondary mb-1">المهندس المسؤول</div>
 <div className="font-medium text-text-primary">{request.assignedEngineer?.name || 'غير مسند'}</div>
 </div>

 <div className="bg-surface-low dark:bg-surface-elevated p-4 rounded-lg border border-transparent dark:border-border-subtle">
 <div className="text-sm text-text-muted dark:text-text-secondary mb-1">نوع الطلب</div>
 <div className="font-medium text-text-primary">{getRequestType(request.request_type)}</div>
 </div>

 <div className="bg-surface-low dark:bg-surface-elevated p-4 rounded-lg border border-transparent dark:border-border-subtle">
 <div className="text-sm text-text-muted dark:text-text-secondary mb-1">تاريخ الإنشاء</div>
 <div className="font-medium text-text-primary">{new Date(request.created_at).toLocaleDateString()}</div>
 </div>

 <div className="bg-surface-low dark:bg-surface-elevated p-4 rounded-lg border border-transparent dark:border-border-subtle">
 <div className="text-sm text-text-muted dark:text-text-secondary mb-1">الأولوية</div>
 <div><ServiceRequestPriorityBadge priority={request.priority} /></div>
 </div>

 <div className="bg-surface-low dark:bg-surface-elevated p-4 rounded-lg border border-transparent dark:border-border-subtle">
 <div className="text-sm text-text-muted dark:text-text-secondary mb-1">الحالة</div>
 <div><ServiceRequestStatusBadge status={request.status} /></div>
 </div>

 </div>

 <div className="bg-surface-low dark:bg-surface-elevated p-4 rounded-lg mb-6 border border-transparent dark:border-border-subtle">
 <div className="text-sm text-text-muted dark:text-text-secondary mb-2">وصف الطلب</div>
 <p className="m-0 leading-relaxed text-text-primary">{request.description || 'لا يوجد وصف'}</p>
 </div>

 </div>
 </div>
 </div>,
 document.body
 )
}
