import React from 'react'
import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ReadingStatus } from '../types'

interface ReadingStatusBadgeProps {
 status: ReadingStatus | null
}

export function ReadingStatusBadge({ status }: ReadingStatusBadgeProps) {
 const { t } = useTranslation('readings')

 switch (status) {
 case 'approved':
 return (
 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-success/10 text-success">
 <CheckCircle2 size={12} />
 {t('status.approved', 'معتمدة')}
 </span>
 )
 case 'rejected':
 return (
 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-error/10 text-error">
 <XCircle size={12} />
 {t('status.rejected', 'مرفوضة')}
 </span>
 )
 case 'pending':
 return (
 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-warning/10 text-warning ">
 <Clock size={12} />
 {t('status.pending', 'قيد المراجعة')}
 </span>
 )
 default:
 return (
 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-outline/10 text-text-muted">
 {t('status.unspecified', 'غير محدد')}
 </span>
 )
 }
}
