import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'
import { X, Calendar, User, Hash, FileText, RefreshCw } from 'lucide-react'
import { Equipment, EquipmentStatus } from '../types'
import { EquipmentStatusBadge } from './EquipmentStatusBadge'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'

interface EquipmentDetailsDrawerProps {
  equipment: Equipment | null
  isOpen: boolean
  onClose: () => void
  onStatusUpdate?: (id: number, status: EquipmentStatus) => Promise<void>
}

export function EquipmentDetailsDrawer({ equipment, isOpen, onClose, onStatusUpdate }: EquipmentDetailsDrawerProps) {
  const { t } = useTranslation('engineer')
  const { isRTL } = useLanguage()

  const [newStatus, setNewStatus] = useState<EquipmentStatus | ''>('')
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (isOpen && equipment) {
      setNewStatus('')
    }
  }, [isOpen, equipment])

  if (!isOpen || !equipment) return null

  const handleStatusSave = async () => {
    if (!newStatus || !onStatusUpdate) return

    try {
      setIsUpdating(true)
      await onStatusUpdate(equipment.id, newStatus)
      setNewStatus('')
    } catch (error) {
      console.error(error)
    } finally {
      setIsUpdating(false)
    }
  }

  const allStatuses: EquipmentStatus[] = ['available', 'maintenance', 'damaged', 'lost']
  const availableOptions = allStatuses.filter(s => s !== equipment.status)

  return createPortal(
    <>
      <div
        className="fixed inset-0 transition-opacity"
        style={{ backgroundColor: 'rgba(15, 23, 42, 0.45)', zIndex: 9998 }}
        onClick={onClose}
      />

      <div
        className={cn(
          "fixed top-0 bottom-0 w-full max-w-md bg-surface text-text shadow-2xl flex flex-col transition-transform transform",
          isRTL ? "left-0" : "right-0"
        )}
        style={{ zIndex: 9999 }}
      >
        <div className="border-b border-border p-6 flex justify-between items-center shrink-0">
          <div>
            <h3 className="font-headline-md text-headline-md font-bold text-primary">
              {t('equipment.details.title')}
            </h3>
            <p className="text-text-muted text-sm mt-1">
              EQ-#{equipment.id}
            </p>
          </div>
          <button
            className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-text-muted hover:text-text"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <div className="flex flex-wrap gap-3">
            <EquipmentStatusBadge status={equipment.status} className="px-3 py-1 text-sm" />
          </div>

          <div className="bg-surface-container-lowest border border-border rounded-xl p-4 space-y-4">
            <div className="flex items-start gap-3">
              <Hash size={18} className="text-text-muted mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-text-muted font-medium mb-1">{t('equipment.table.name')}</p>
                <p className="text-sm text-text font-medium">{equipment.equipment_name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Hash size={18} className="text-text-muted mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-text-muted font-medium mb-1">{t('equipment.table.serialNumber')}</p>
                <p className="text-sm text-text font-medium">{equipment.serial_number || t('equipment.details.notSpecified')}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <User size={18} className="text-text-muted mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-text-muted font-medium mb-1">{t('equipment.table.assignedUser')}</p>
                <p className="text-sm text-text font-medium">{equipment.user?.name || t('equipment.details.unassigned')}</p>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={18} className="text-text-muted" />
              <h4 className="text-sm font-semibold text-text">{t('equipment.table.notes')}</h4>
            </div>
            <p className="text-sm text-text whitespace-pre-wrap">
              {equipment.notes || t('equipment.details.noNotes')}
            </p>
          </div>

          <div className="bg-surface-container-lowest border border-border rounded-xl p-4 space-y-4">
            <div className="flex items-start gap-3">
              <Calendar size={18} className="text-text-muted mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-text-muted font-medium mb-1">{t('equipment.table.createdAt')}</p>
                <p className="text-sm text-text font-medium">{new Date(equipment.created_at).toLocaleString()}</p>
                <p className="text-xs text-text-muted mt-0.5">{t('equipment.details.createdBy')} {equipment.creator?.name || '-'}</p>
              </div>
            </div>
          </div>

          {onStatusUpdate && availableOptions.length > 0 && (
            <div className="bg-surface-container-lowest border border-border rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-2 mb-2">
                <RefreshCw size={18} className="text-primary" />
                <h4 className="text-sm font-bold text-primary">{t('equipment.details.statusChange.title')}</h4>
              </div>

              <Select
                label={t('equipment.details.statusChange.newStatus')}
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as EquipmentStatus)}
                options={availableOptions.map(opt => ({
                  label: t(`equipment.status.${opt}`),
                  value: opt
                }))}
                placeholder={t('equipment.details.statusChange.newStatus')}
                fullWidth
              />
              
              <Button 
                className="w-full mt-2" 
                disabled={!newStatus || isUpdating}
                onClick={handleStatusSave}
              >
                {isUpdating ? t('equipment.details.statusChange.updating') : t('equipment.details.statusChange.saveStatus')}
              </Button>
            </div>
          )}

        </div>
      </div>
    </>,
    document.body
  )
}
