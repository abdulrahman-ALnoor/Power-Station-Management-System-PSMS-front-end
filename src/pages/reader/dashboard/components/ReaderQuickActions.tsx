import { Link } from 'react-router-dom'
import { Plus, Search, List, Wrench } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useLanguage } from '@/hooks/useLanguage'

interface ReaderQuickActionsProps {
 onAddReadingClick: () => void
 onCreateRequestClick: () => void
}

export function ReaderQuickActions({ onAddReadingClick, onCreateRequestClick }: ReaderQuickActionsProps) {
 const { t } = useLanguage('reader')

 return (
 <div className="card border border-border/20 shadow-sm h-full">
 <h2 className="text-headline mb-4 ">{t('quickActions.title')}</h2>
 <div className="flex flex-col gap-3">
 <QuickActionButton
 onClick={onAddReadingClick}
 icon={<Plus size={20} />}
 label={t('quickActions.addReading')}
 isPrimary
 />
 <QuickActionLink
 to="/reader/readings"
 icon={<List size={20} />}
 label={t('quickActions.viewReadings')}
 />
 <QuickActionButton
 onClick={onCreateRequestClick}
 icon={<Wrench size={20} />}
 label={t('quickActions.requestService')}
 />
 </div>
 </div>
 )
}

function QuickActionLink({
 to,
 icon,
 label,
 isPrimary
}: {
 to: string
 icon: React.ReactNode
 label: string
 isPrimary?: boolean
}) {
 return (
 <Link
 to={to}
 className={cn(
 "flex flex-row items-center justify-start px-4 py-3 gap-3 rounded-lg transition-colors group",
 isPrimary
 ? "bg-primary text-on-primary hover:bg-primary-hover shadow-sm "
 : "bg-surface-low border border-border/30 hover:border-border/60 hover:bg-surface-hover :bg-surface/10 :border-white/20"
 )}
 >
 <div className={cn(
 "transition-colors shrink-0",
 isPrimary ? "text-on-primary" : "text-text-muted group-hover:text-text :text-white"
 )}>
 {icon}
 </div>
 <span className={cn(
 "text-sm font-medium transition-colors",
 isPrimary ? "text-on-primary" : "text-text-muted group-hover:text-text :text-white"
 )}>
 {label}
 </span>
 </Link>
 )
}

function QuickActionButton({
 onClick,
 icon,
 label,
 isPrimary
}: {
 onClick: () => void
 icon: React.ReactNode
 label: string
 isPrimary?: boolean
}) {
 return (
 <button
 onClick={onClick}
 type="button"
 className={cn(
 "flex flex-row items-center justify-start px-4 py-3 gap-3 rounded-lg transition-colors group w-full text-start",
 isPrimary
 ? "bg-primary text-on-primary hover:bg-primary-dark shadow-sm "
 : "bg-surface-low border border-border/30 hover:border-border/60 hover:bg-surface-hover :bg-surface/10 :border-white/20"
 )}
 >
 <div className={cn(
 "transition-colors shrink-0",
 isPrimary ? "text-on-primary" : "text-text-muted group-hover:text-text :text-white"
 )}>
 {icon}
 </div>
 <span className={cn(
 "text-sm font-medium transition-colors",
 isPrimary ? "text-on-primary" : "text-text-muted group-hover:text-text :text-white"
 )}>
 {label}
 </span>
 </button>
 )
}
