import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { ServiceRequestStatus } from '../types'

interface ServiceRequestStatusBadgeProps {
  status: ServiceRequestStatus
  className?: string
}

export function ServiceRequestStatusBadge({ status, className }: ServiceRequestStatusBadgeProps) {
  const { t } = useTranslation('engineer')

  const getVariant = (): 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'neutral' => {
    switch (status) {
      case 'completed': return 'success'
      case 'pending': return 'warning'
      case 'in_progress': return 'primary'
      case 'assigned': return 'info'
      case 'cancelled': return 'danger'
      default: return 'neutral'
    }
  }

  return (
    <Badge variant={getVariant()} className={className}>
      {t(`serviceRequests.status.${status}`)}
    </Badge>
  )
}
