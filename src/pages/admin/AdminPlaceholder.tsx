// ============================================================
// AdminPlaceholder — Temporary page shown until real screens
// are implemented in later steps
// ============================================================

import { CheckCircle } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

interface AdminPlaceholderProps {
 page: string
}

const PAGE_META: Record<string, { icon: string; color: string }> = {
 dashboard: { icon: '📊', color: 'var(--color-primary)' },
 employees: { icon: '👥', color: 'var(--color-steel-blue)' },
 customers: { icon: '🏠', color: 'var(--color-info)' },
 meters: { icon: '⚡', color: 'var(--color-accent-amber)' },
 stations: { icon: '🏭', color: 'var(--color-primary-dark)' },
 readings: { icon: '📋', color: 'var(--color-success)' },
 requests: { icon: '🔧', color: 'var(--color-warning)' },
 invoices: { icon: '🧾', color: 'var(--color-info)' },
 reports: { icon: '📈', color: 'var(--color-success)' },
 settings: { icon: '⚙️', color: 'var(--color-text-muted)' },
}

export default function AdminPlaceholder({ page }: AdminPlaceholderProps) {
 const { isRTL } = useLanguage()
 const meta = PAGE_META[page] ?? { icon: '📄', color: 'var(--color-primary)' }

 return (
 <div
 className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center"
 dir={isRTL ? 'rtl' : 'ltr'}
 >
 {/* Icon */}
 <div
 className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl"
 style={{ background: 'var(--color-surface-container)' }}
 >
 {meta.icon}
 </div>

 {/* Status badge */}
 <div
 className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
 style={{
 background: 'var(--color-success-light)',
 color: 'var(--color-success)',
 }}
 >
 <CheckCircle size={16} />
 <span>Foundation Ready — Step 1 Complete</span>
 </div>

 {/* Title */}
 <h2
 className="text-display capitalize"
 style={{ color: meta.color }}
 >
 {page}
 </h2>

 {/* Description */}
 <p
 className="text-body-lg max-w-md"
 style={{ color: 'var(--color-text-muted)' }}
 >
 This page will be implemented in a future step. The routing, layout, and
 architecture are ready.
 </p>

 {/* Architecture checklist */}
 <div
 className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-start max-w-lg w-full"
 style={{ color: 'var(--color-text)' }}
 >
 {[
 '✅ TypeScript enabled',
 '✅ Tailwind CSS v4 active',
 '✅ RTL / LTR architecture ready',
 '✅ Arabic / English i18n ready',
 '✅ Admin layout shell working',
 '✅ Data-driven navigation config',
 '✅ Service / API layer prepared',
 '✅ Shared components prepared',
 ].map((item) => (
 <div
 key={item}
 className="px-4 py-2 rounded-lg text-sm"
 style={{ background: 'var(--color-surface-container)' }}
 >
 {item}
 </div>
 ))}
 </div>
 </div>
 )
}
