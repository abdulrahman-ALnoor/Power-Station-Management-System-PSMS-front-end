import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { ServiceRequestPriority } from '../types'

interface ServiceRequestPriorityBadgeProps {
  priority: ServiceRequestPriority | null
  className?: string
}

export function ServiceRequestPriorityBadge({ priority, className }: ServiceRequestPriorityBadgeProps) {
  const { t } = useTranslation('engineer')

  if (!priority) return null

  const getVariant = (): 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'neutral' => {
    switch (priority) {
      case 'emergency': return 'danger'
      case 'high': return 'warning'
      case 'medium': return 'info'
      case 'low': return 'success'
      default: return 'neutral'
    }
  }

  return (
    <Badge variant={getVariant()} className={className}>
      {t(`serviceRequests.priority.${priority}`)}
    </Badge>
  )
}
