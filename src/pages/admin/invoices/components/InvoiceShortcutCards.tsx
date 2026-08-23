import { useTranslation } from 'react-i18next'
import {
  FileText,
  Clock,
  Wallet,
  ChevronRight,
  ChevronLeft,
  FileBarChart2,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'
import { useLanguage } from '@/hooks/useLanguage'

export function InvoiceShortcutCards() {
  const { t } = useTranslation('invoices')

  const { isRTL } = useLanguage()

  const navigate = useNavigate()

  const shortcuts = [
    {
      id: 'revenueReport',

      title: t('shortcuts.revenueReport'),

      description: t(
        'shortcuts.revenueReportDesc',
      ),

      icon: FileBarChart2,

      colors:
        'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-fixed',

      path: '/admin/reports/revenue',
    },

    {
      id: 'overdueInvoices',

      title: t(
        'shortcuts.overdueInvoices',
      ),

      description: t(
        'shortcuts.overdueInvoicesDesc',
      ),

      icon: Clock,

      colors:
        'bg-error/10 text-error dark:bg-error/20 dark:text-error',

      path: '/admin/reports/overdue-invoices',
    },

    {
      id: 'collections',

      title: t(
        'shortcuts.collections',
      ),

      description: t(
        'shortcuts.collectionsDesc',
      ),

      icon: Wallet,

      colors:
        'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500',

     path: '/admin/reports/collections',
    },

    {
      id: 'accountStatement',

      title: t(
        'shortcuts.accountStatement',
      ),

      description: t(
        'shortcuts.accountStatementDesc',
      ),

      icon: FileText,

      colors:
        'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500',

     path: '/admin/reports/account-statement',
    },
  ]

  const handleShortcutClick = (
    path: string,
  ) => {
    if (path) {
      navigate(path)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {shortcuts.map((shortcut) => {
        const Icon = shortcut.icon

        const Chevron = isRTL
          ? ChevronLeft
          : ChevronRight

        return (
          <div
            key={shortcut.id}
            onClick={() =>
              handleShortcutClick(
                shortcut.path,
              )
            }
            className="
              bg-surface-white
              dark:bg-surface-container-low
              p-6
              rounded-xl
              shadow-[0px_4px_12px_rgba(0,0,0,0.05)]
              flex
              items-start
              gap-4
              hover:shadow-md
              transition-shadow
              cursor-pointer
              group
              border
              border-transparent
              hover:border-outline-variant
              dark:hover:border-border-muted
            "
          >
            {/* الأيقونة */}
            <div
              className={`
                w-12
                h-12
                rounded-xl
                flex
                items-center
                justify-center
                shrink-0
                ${shortcut.colors}
              `}
            >
              <Icon size={24} />
            </div>

            {/* المحتوى */}
            <div className="flex-grow">
              <h4
                className="
                  font-title-md
                  font-bold
                  text-on-surface
                  dark:text-on-dark
                  mb-1
                "
              >
                {shortcut.title}
              </h4>

              <p
                className="
                  text-label-sm
                  text-outline
                  mb-3
                "
              >
                {shortcut.description}
              </p>

              {/* عرض التقرير */}
              <div
                className="
                  flex
                  items-center
                  gap-1
                  text-label-md
                  font-bold
                  text-primary
                  dark:text-primary-fixed
                  group-hover:underline
                "
              >
                <span>
                  {t(
                    'shortcuts.viewReport',
                  )}
                </span>

                <Chevron size={16} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
