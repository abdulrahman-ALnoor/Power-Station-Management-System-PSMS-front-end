import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { PlusCircle, PenTool, FileText } from 'lucide-react'

export function QuickActions() {
 const { t } = useTranslation('engineer')

 return (
 <div className="bg-surface rounded-xl border border-border shadow-sm p-6 flex flex-col">
 <h4 className="font-headline text-headline text-primary mb-6">
 {t('dashboard.quickActions.title')}
 </h4>
 <div className="flex flex-col gap-3">
 <Link 
 to="/engineer/service-requests/create"
 className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-[var(--color-surface-container-low)] transition-colors text-primary font-medium group"
 >
 <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
 <PlusCircle size={20} />
 </div>
 <span>{t('dashboard.quickActions.addRequest')}</span>
 </Link>
 <Link 
 to="/engineer/equipment"
 className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-[var(--color-surface-container-low)] transition-colors text-primary font-medium group"
 >
 <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
 <PenTool size={20} />
 </div>
 <span>{t('dashboard.quickActions.requestEquipment')}</span>
 </Link>
 <Link 
 to="/engineer/reports"
 className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-[var(--color-surface-container-low)] transition-colors text-primary font-medium group"
 >
 <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
 <FileText size={20} />
 </div>
 <span>{t('dashboard.quickActions.writeReport')}</span>
 </Link>
 </div>
 </div>
 )
}
