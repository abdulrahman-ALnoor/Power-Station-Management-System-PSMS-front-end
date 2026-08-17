import { useTranslation } from 'react-i18next'
import { getMockCollections } from '@/data/mock/dashboard'
import { Landmark, MonitorSmartphone, Wallet } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'

export function RecentCollections() {
  const { t } = useTranslation('dashboard')
  const { isRTL } = useLanguage()
  const collections = getMockCollections()

  const getIconConfig = (method: string) => {
    switch (method) {
      case 'pos':
        return { icon: <MonitorSmartphone size={20} />, bg: 'var(--color-success-light)', color: 'var(--color-success)' }
      case 'bank_transfer':
        return { icon: <Landmark size={20} />, bg: 'rgba(79, 121, 183, 0.1)', color: 'var(--color-steel-blue)' }
      case 'cash':
        return { icon: <Wallet size={20} />, bg: 'rgba(253, 187, 18, 0.1)', color: 'var(--color-accent)' }
      default:
        return { icon: <MonitorSmartphone size={20} />, bg: 'var(--color-surface-container)', color: 'var(--color-primary)' }
    }
  }

  // To properly translate customer names inside the parameterized translations,
  // we map the customer keys. In a real app this would just be user data.
  const getCustomerName = (index: number) => {
    switch (index) {
      case 0: return t('collections.customerName1')
      case 1: return t('collections.customerName2')
      case 2: return t('collections.customerName3')
      default: return 'Customer'
    }
  }

  return (
    <div className="xl:col-span-2 bg-surface p-6 rounded-xl border border-border shadow-sm">
      <h4 className="font-headline text-headline text-primary mb-6">
        {t('collections.title')}
      </h4>
      <div className="space-y-4">
        {collections.map((col, idx) => {
          const { icon, bg, color } = getIconConfig(col.method)
          return (
            <div 
              key={col.id} 
              className={cn(
                "flex items-center justify-between p-4 border border-[var(--color-outline-variant)] rounded-lg hover:border-[var(--color-steel-blue)] transition-all duration-300",
                isRTL ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn("flex items-center gap-4", isRTL ? "flex-row-reverse" : "flex-row")}>
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: bg, color: color }}
                >
                  {icon}
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="font-semibold text-sm text-primary">
                    Invoice #{col.id}
                  </p>
                  <p className="text-[10px] text-outline mt-0.5">
                    {t(col.customerInfoKey, { customer: getCustomerName(idx) })}
                  </p>
                </div>
              </div>
              
              <div className={isRTL ? "text-right" : "text-left"}>
                <p className={cn("font-bold", col.method === 'pos' ? "text-[var(--color-success)]" : "text-primary")}>
                  {col.amount}
                </p>
                <p className="text-[10px] text-outline mt-0.5">
                  {col.date}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
