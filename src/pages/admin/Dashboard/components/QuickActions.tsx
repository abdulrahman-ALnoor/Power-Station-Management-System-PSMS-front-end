import { useTranslation } from 'react-i18next'
import {
 UserPlus,
 Zap,
 FileEdit,
 ReceiptText,
 BadgePlus,
 Wrench,
 Headset,
 FileText,
} from 'lucide-react'

export type QuickActionType = 
 | 'addCustomer' 
 | 'addMeter' 
 | 'addReading' 
 | 'createInvoice' 
 | 'addEmployee' 
 | 'addEquipment' 
 | 'requestService' 
 | 'viewReports'

interface QuickActionsProps {
 onActionSelect?: (action: QuickActionType) => void
}

export function QuickActions({ onActionSelect }: QuickActionsProps) {
 const { t } = useTranslation('dashboard')

 const actions: { icon: React.ReactNode; labelKey: string; actionId: QuickActionType }[] = [
 { icon: <UserPlus size={28} />, labelKey: 'quickActions.addCustomer', actionId: 'addCustomer' },
 { icon: <Zap size={28} />, labelKey: 'quickActions.addMeter', actionId: 'addMeter' },
 { icon: <FileEdit size={28} />, labelKey: 'quickActions.addReading', actionId: 'addReading' },
 { icon: <ReceiptText size={28} />, labelKey: 'quickActions.createInvoice', actionId: 'createInvoice' },
 { icon: <BadgePlus size={28} />, labelKey: 'quickActions.addEmployee', actionId: 'addEmployee' },
 { icon: <Wrench size={28} />, labelKey: 'quickActions.addEquipment', actionId: 'addEquipment' },
 { icon: <Headset size={28} />, labelKey: 'quickActions.requestService', actionId: 'requestService' },
 { icon: <FileText size={28} />, labelKey: 'quickActions.viewReports', actionId: 'viewReports' },
 ]

 return (
 <div className="xl:col-span-2 bg-surface p-6 rounded-xl border border-border shadow-sm">
 <h4 className="font-headline text-headline text-primary mb-6">
 {t('quickActions.title')}
 </h4>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
 {actions.map((action, idx) => (
 <button
 key={idx}
 onClick={() => onActionSelect?.(action.actionId)}
 className="flex flex-col items-center gap-3 p-4 rounded-xl border border-[var(--color-outline-variant)] hover:border-[var(--color-accent)] hover:bg-[rgba(253,187,18,0.05)] transition-all duration-300 group outline-none focus-visible:ring-2 focus-visible:ring-primary"
 aria-label={t(action.labelKey)}
 >
 <span className="text-primary group-hover:text-[var(--color-amber-gold)] transition-colors duration-300 flex items-center justify-center">
 {action.icon}
 </span>
 <span className="font-semibold text-xs text-text text-center mt-1">
 {t(action.labelKey)}
 </span>
 </button>
 ))}
 </div>
 </div>
 )
}
