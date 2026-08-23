import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MoreVertical, Eye, Calendar, CheckCircle2, Edit2, Trash2 } from 'lucide-react'
import { ServiceRequest } from '../types'
import { ServiceRequestStatusBadge } from './ServiceRequestStatusBadge'
import { ServiceRequestPriorityBadge } from './ServiceRequestPriorityBadge'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'

interface ServiceRequestTableProps {
 data: ServiceRequest[]
 isLoading: boolean
 onViewDetails: (request: ServiceRequest) => void
 onStartExecution?: (request: ServiceRequest) => void
 onCompleteRequest?: (request: ServiceRequest) => void
 onCancelRequest?: (request: ServiceRequest) => void
 onEdit?: (request: ServiceRequest) => void
 onDelete?: (request: ServiceRequest) => void
}

export function ServiceRequestTable({
 data,
 isLoading,
 onViewDetails,
 onStartExecution,
 onCompleteRequest,
 onCancelRequest,
 onEdit,
 onDelete,
}: ServiceRequestTableProps) {
 const { t } = useTranslation('engineer')
 const { isRTL } = useLanguage()
 const [openMenuId, setOpenMenuId] = useState<number | null>(null)
 const menuRef = useRef<HTMLDivElement>(null)

 const toggleMenu = (id: number) => {
 setOpenMenuId(openMenuId === id ? null : id)
 }

 if (isLoading) {
 return (
 <div className="bg-surface rounded-xl border border-border shadow-sm p-8 flex justify-center items-center">
 <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
 </div>
 )
 }

 if (data.length === 0) {
 return (
 <div className="bg-surface rounded-xl border border-border shadow-sm p-12 flex flex-col items-center justify-center text-center">
 <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4 text-text-muted">
 <MoreVertical size={32} />
 </div>
 <p className="text-lg font-medium text-text mb-1">{t('serviceRequests.emptyState')}</p>
 </div>
 )
 }

 return (
 <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden flex flex-col relative z-0">
 <div className="overflow-x-auto min-h-[300px]">
 <table className={cn("w-full text-sm", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
 <thead>
 <tr className="bg-[var(--color-surface-container-low)] text-[var(--color-text-muted)] font-semibold border-b border-border">
 <th className="p-4 whitespace-nowrap">{t('serviceRequests.table.requestNumber')}</th>
 <th className="p-4 whitespace-nowrap">{t('serviceRequests.table.customer')}</th>
 <th className="p-4 whitespace-nowrap">{t('serviceRequests.table.meter')}</th>
 <th className="p-4 whitespace-nowrap">{t('serviceRequests.table.type')}</th>
 <th className="p-4 whitespace-nowrap">{t('serviceRequests.table.priority')}</th>
 <th className="p-4 whitespace-nowrap">{t('serviceRequests.table.status')}</th>
 <th className="p-4 whitespace-nowrap">{t('serviceRequests.table.assignedTo')}</th>
 <th className="p-4 whitespace-nowrap">{t('serviceRequests.table.date')}</th>
 <th className="p-4 whitespace-nowrap text-center">{t('serviceRequests.table.actions')}</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-[var(--color-border)]">
 {data.map((req) => (
 <tr key={req.id} className="hover:bg-[var(--color-surface-container-lowest)] transition-colors">
 <td className="p-4 font-bold text-primary whitespace-nowrap">{req.request_number || `SR-${String(req.id).padStart(4, '0')}`}</td>
 <td className="p-4 text-text whitespace-nowrap">{req.customer?.full_name || '-'}</td>
 <td className="p-4 text-text whitespace-nowrap">{req.meter?.meter_number || '-'}</td>
 <td className="p-4 text-text whitespace-nowrap">{t(`serviceRequests.type.${req.request_type}`)}</td>
 <td className="p-4 whitespace-nowrap">
 <ServiceRequestPriorityBadge priority={req.priority} />
 </td>
 <td className="p-4 whitespace-nowrap">
 <ServiceRequestStatusBadge status={req.status} />
 </td>
 <td className="p-4 text-text whitespace-nowrap">{req.assignedEngineer?.name || t('serviceRequests.table.unassigned', 'غير مسند')}</td>
 <td className="p-4 text-text-muted whitespace-nowrap">{new Date(req.created_at).toLocaleDateString()}</td>
 <td className="p-4 text-center relative">
 <div ref={openMenuId === req.id ? menuRef : null} className="relative inline-block text-right">
 <button
 type="button"
 onClick={() => toggleMenu(req.id)}
 className="p-1.5 rounded-lg hover:bg-surface-container-high transition-colors text-text-muted hover:text-text"
 >
 <MoreVertical size={18} />
 </button>

 {/* Actions Dropdown */}
 {openMenuId === req.id && (
 <div
 className={cn(
 "absolute top-full mt-1 w-48 bg-surface rounded-xl border border-border shadow-lg py-1 z-50",
 isRTL ? "left-4" : "right-4"
 )}
 >
 <button
 type="button"
 className={cn("w-full px-4 py-2 text-sm flex items-center gap-3 hover:bg-surface-low transition-colors text-text", isRTL ? "text-right" : "text-left")}
 onClick={() => {
 setOpenMenuId(null)
 onViewDetails(req)
 }}
 >
 <Eye size={16} className="text-text-muted" />
 {t('serviceRequests.actions.viewDetails')}
 </button>

 {onStartExecution && (req.status === 'pending' || req.status === 'assigned') && (
 <button
 type="button"
 className={cn("w-full px-4 py-2 text-sm flex items-center gap-3 hover:bg-surface-low transition-colors text-text", isRTL ? "text-right" : "text-left")}
 onClick={() => {
 setOpenMenuId(null)
 onStartExecution(req)
 }}
 >
 <Calendar size={16} className="text-text-muted" />
 {t('serviceRequests.actions.startExecution', 'بدء التنفيذ')}
 </button>
 )}

 {onCompleteRequest && req.status === 'in_progress' && (
 <button
 type="button"
 className={cn("w-full px-4 py-2 text-sm flex items-center gap-3 hover:bg-surface-low transition-colors text-text", isRTL ? "text-right" : "text-left")}
 onClick={() => {
 setOpenMenuId(null)
 onCompleteRequest(req)
 }}
 >
 <CheckCircle2 size={16} className="text-text-muted" />
 {t('serviceRequests.actions.completeRequest', 'إكمال الطلب')}
 </button>
 )}

 {onCancelRequest && req.status !== 'completed' && req.status !== 'cancelled' && (
 <button
 type="button"
 className={cn("w-full px-4 py-2 text-sm flex items-center gap-3 hover:bg-surface-low transition-colors text-red-600", isRTL ? "text-right" : "text-left")}
 onClick={() => {
 setOpenMenuId(null)
 onCancelRequest(req)
 }}
 >
 <Trash2 size={16} className="text-red-500" />
 <span>إلغاء الطلب</span>
 </button>
 )}

 {onEdit && req.status !== 'completed' && req.status !== 'cancelled' && (
 <button
 type="button"
 className={cn("w-full px-4 py-2 text-sm flex items-center gap-3 hover:bg-surface-low transition-colors text-text", isRTL ? "text-right" : "text-left")}
 onClick={() => {
 setOpenMenuId(null)
 onEdit(req)
 }}
 >
 <Edit2 size={16} className="text-text-muted" />
 {t('serviceRequests.actions.edit', 'تعديل الطلب')}
 </button>
 )}

 {onDelete && (
 <button
 type="button"
 className={cn("w-full px-4 py-2 text-sm flex items-center gap-3 hover:bg-surface-low transition-colors text-error", isRTL ? "text-right" : "text-left")}
 onClick={() => {
 setOpenMenuId(null)
 onDelete(req)
 }}
 >
 <Trash2 size={16} className="text-error" />
 {t('serviceRequests.actions.delete', 'حذف الطلب')}
 </button>
 )}
 </div>
 )}
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )
}
