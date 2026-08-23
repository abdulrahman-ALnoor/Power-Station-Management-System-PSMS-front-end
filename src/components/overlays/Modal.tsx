// ============================================================
// Modal — Accessible dialog overlay
// ============================================================

import {
 useEffect,
 useRef,
 type ReactNode,
 type KeyboardEvent,
} from 'react'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { SizeVariant } from '@/types/common'

interface ModalProps {
 open: boolean
 onClose: () => void
 title?: string
 children: ReactNode
 footer?: ReactNode
 size?: SizeVariant | 'xl'
 closeOnOverlayClick?: boolean
}

const SIZE_MAP: Record<string, string> = {
 sm: 'max-w-sm',
 md: 'max-w-lg',
 lg: 'max-w-2xl',
 xl: 'max-w-4xl',
}

export function Modal({
 open,
 onClose,
 title,
 children,
 footer,
 size = 'md',
 closeOnOverlayClick = true,
}: ModalProps) {
 const dialogRef = useRef<HTMLDivElement>(null)

 // Trap focus and handle ESC
 useEffect(() => {
 if (open) {
 document.body.style.overflow = 'hidden'
 dialogRef.current?.focus()
 } else {
 document.body.style.overflow = ''
 }
 return () => {
 document.body.style.overflow = ''
 }
 }, [open])

 const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
 if (e.key === 'Escape') onClose()
 }

 if (!open) return null

 return (
 <div
 className="fixed inset-0 z-50 flex items-center justify-center p-4"
 role="presentation"
 >
 {/* Backdrop */}
 <div
 className="absolute inset-0 bg-black/50 backdrop-blur-sm"
 onClick={closeOnOverlayClick ? onClose : undefined}
 aria-hidden="true"
 />

 {/* Dialog */}
 <div
 role="dialog"
 ref={dialogRef}
 className={cn(
 'relative z-10 w-full rounded-2xl border',
 'bg-surface flex flex-col max-h-[90vh] overflow-hidden',
 SIZE_MAP[size] ?? SIZE_MAP.md,
 )}
 style={{
 boxShadow: 'var(--shadow-modal)',
 borderColor: 'var(--color-border)',
 }}
 aria-modal="true"
 aria-labelledby={title ? 'modal-title' : undefined}
 onKeyDown={handleKeyDown}
 tabIndex={-1}
 >
 {/* Header */}
 {title && (
 <div
 className="flex items-center justify-between px-6 py-4 border-b shrink-0"
 style={{ borderColor: 'var(--color-border)' }}
 >
 <h2 id="modal-title" className="text-headline" style={{ color: 'var(--color-text)' }}>
 {title}
 </h2>
 <button
 onClick={onClose}
 className="p-1.5 rounded-lg hover:bg-surface-low transition-colors"
 style={{ color: 'var(--color-text-muted)' }}
 aria-label="Close dialog"
 >
 <X size={18} />
 </button>
 </div>
 )}

 {/* Content */}
 <div className="flex-1 overflow-y-auto px-6 py-5">
 {children}
 </div>

 {/* Footer */}
 {footer && (
 <div
 className="flex items-center justify-end gap-3 px-6 py-4 border-t shrink-0"
 style={{ borderColor: 'var(--color-border)' }}
 >
 {footer}
 </div>
 )}
 </div>
 </div>
 )
}
