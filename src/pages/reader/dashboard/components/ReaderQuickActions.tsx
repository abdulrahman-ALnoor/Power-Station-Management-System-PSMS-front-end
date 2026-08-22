import { Link } from 'react-router-dom'
import { Plus, Search, List, Wrench } from 'lucide-react'
import { cn } from '@/utils/cn'

interface ReaderQuickActionsProps {
  onAddReadingClick: () => void
  onCreateRequestClick: () => void
}

export function ReaderQuickActions({ onAddReadingClick, onCreateRequestClick }: ReaderQuickActionsProps) {
  return (
    <div className="card dark:bg-surface border border-border/20 dark:border-white/5 shadow-sm h-full">
      <h2 className="text-headline mb-4 dark:text-white">إجراءات سريعة</h2>
      <div className="flex flex-col gap-3">
        <QuickActionButton 
          onClick={onAddReadingClick}
          icon={<Plus size={20} />} 
          label="إضافة قراءة" 
          isPrimary 
        />
        <QuickActionLink 
          to="/reader/readings" 
          icon={<List size={20} />} 
          label="عرض القراءات" 
        />
        <QuickActionLink 
          to="/reader/equipment" 
          icon={<Search size={20} />} 
          label="بحث عن عداد" 
        />
        <QuickActionButton 
          onClick={onCreateRequestClick}
          icon={<Wrench size={20} />} 
          label="طلب خدمة" 
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
          ? "bg-primary text-on-primary hover:bg-primary-hover shadow-sm dark:shadow-none" 
          : "bg-surface-low border border-border/30 hover:border-border/60 hover:bg-surface-hover dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 dark:hover:border-white/20"
      )}
    >
      <div className={cn(
        "transition-colors shrink-0",
        isPrimary ? "text-on-primary" : "text-text-muted group-hover:text-text dark:text-white/80 dark:group-hover:text-white"
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-sm font-medium transition-colors",
        isPrimary ? "text-on-primary" : "text-text-muted group-hover:text-text dark:text-white/80 dark:group-hover:text-white"
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
          ? "bg-primary text-on-primary hover:bg-primary-dark shadow-sm dark:shadow-none" 
          : "bg-surface-low border border-border/30 hover:border-border/60 hover:bg-surface-hover dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 dark:hover:border-white/20"
      )}
    >
      <div className={cn(
        "transition-colors shrink-0",
        isPrimary ? "text-on-primary" : "text-text-muted group-hover:text-text dark:text-white/80 dark:group-hover:text-white"
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-sm font-medium transition-colors",
        isPrimary ? "text-on-primary" : "text-text-muted group-hover:text-text dark:text-white/80 dark:group-hover:text-white"
      )}>
        {label}
      </span>
    </button>
  )
}
