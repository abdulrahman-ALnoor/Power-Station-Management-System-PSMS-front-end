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
 style={{
 position: 'fixed',
 inset: 0,
 zIndex: 999999,
 direction: isRTL ? 'rtl' : 'ltr'
 }}
 >
 <div
 onClick={onClose}
 style={{
 position: 'absolute',
 inset: 0,
 background: 'rgba(0,0,0,0.45)',
 }}
 />

 <div
 onClick={(e) => e.stopPropagation()}
 style={{
 position: 'absolute',
 top: '50%',
 left: '50%',
 transform: 'translate(-50%, -50%)',
 width: 'min(720px, calc(100vw - 32px))',
 maxHeight: 'calc(100vh - 32px)',
 overflowY: 'auto',
 background: '#ffffff',
 opacity: 1,
 filter: 'none',
 backdropFilter: 'none',
 borderRadius: '16px',
 boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
 zIndex: 1000000,
 }}
 >
 <div style={{ padding: '24px' }}>
 {/* Header */}
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
 <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>تفاصيل الطلب</h2>
 <button 
 type="button" 
 onClick={onClose}
 style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
 >
 ✕
 </button>
 </div>

 {/* Details Content */}
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
 
 <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
 <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>رقم الطلب</div>
 <div style={{ fontWeight: '500' }}>REQ-#{request.id}</div>
 </div>

 <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
 <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>العميل</div>
 <div style={{ fontWeight: '500' }}>{request.customer?.full_name || '-'}</div>
 </div>

 <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
 <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>رقم العداد</div>
 <div style={{ fontWeight: '500' }}>{request.meter?.meter_number || '-'}</div>
 </div>

 <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
 <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>المهندس المسؤول</div>
 <div style={{ fontWeight: '500' }}>{request.assignedEngineer?.name || 'غير مسند'}</div>
 </div>

 <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
 <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>نوع الطلب</div>
 <div style={{ fontWeight: '500' }}>{getRequestType(request.request_type)}</div>
 </div>

 <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
 <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>تاريخ الإنشاء</div>
 <div style={{ fontWeight: '500' }}>{new Date(request.created_at).toLocaleDateString()}</div>
 </div>

 <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
 <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>الأولوية</div>
 <div><ServiceRequestPriorityBadge priority={request.priority} /></div>
 </div>

 <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
 <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>الحالة</div>
 <div><ServiceRequestStatusBadge status={request.status} /></div>
 </div>

 </div>

 <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
 <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '8px' }}>وصف الطلب</div>
 <p style={{ margin: 0, lineHeight: 1.6 }}>{request.description || 'لا يوجد وصف'}</p>
 </div>

 </div>
 </div>
 </div>,
 document.body
 )
}
