// ============================================================
// ConfirmDialog — Confirmation dialog for destructive actions
// ============================================================

import { AlertTriangle } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/hooks/useLanguage'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  variant?: 'danger' | 'warning'
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  loading = false,
  variant = 'danger',
}: ConfirmDialogProps) {
  const { t } = useLanguage()

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      closeOnOverlayClick={!loading}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelLabel ?? t('common:cancel')}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel ?? t('common:confirm')}
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center gap-4 text-center py-4">
        {/* Warning icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background:
              variant === 'danger'
                ? 'var(--color-danger-light)'
                : 'var(--color-warning-light)',
            color:
              variant === 'danger'
                ? 'var(--color-danger)'
                : 'var(--color-warning)',
          }}
        >
          <AlertTriangle size={24} />
        </div>

        {/* Title */}
        <h3 className="text-headline" style={{ color: 'var(--color-text)' }}>
          {title ?? t('common:messages.confirmDelete')}
        </h3>

        {/* Message */}
        <p className="text-body" style={{ color: 'var(--color-text-muted)' }}>
          {message ?? t('common:messages.deleteWarning')}
        </p>
      </div>
    </Modal>
  )
}
