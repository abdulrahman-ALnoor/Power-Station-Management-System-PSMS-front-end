import { useTranslation } from 'react-i18next'
import { EquipmentStatus } from '../types'
import { cn } from '@/utils/cn'

interface EquipmentStatusBadgeProps {
 status: EquipmentStatus
 className?: string
}

export function EquipmentStatusBadge({ status, className }: EquipmentStatusBadgeProps) {
 const { t } = useTranslation('engineer')

 const variants: Record<EquipmentStatus, { bg: string; text: string }> = {
 available: { bg: 'bg-emerald-100 ', text: 'text-emerald-700 ' },
 maintenance: { bg: 'bg-amber-100 ', text: 'text-amber-700 ' },
 damaged: { bg: 'bg-red-100 ', text: 'text-red-700 ' },
 lost: { bg: 'bg-slate-100 ', text: 'text-slate-700 ' },
 }

 const { bg, text } = variants[status] || variants['available']

 return (
 <span
 className={cn(
 "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap",
 bg,
 text,
 className
 )}
 >
 {t(`equipment.status.${status}`)}
 </span>
 )
}
