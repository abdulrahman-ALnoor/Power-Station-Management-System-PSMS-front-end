import { useTranslation } from 'react-i18next'
import { EngineerDashboardStats } from './components/EngineerDashboardStats'
import { ServiceRequestStatusChart } from './components/ServiceRequestStatusChart'
import { EngineerPerformanceChart } from './components/EngineerPerformanceChart'
import { RecentServiceRequests } from './components/RecentServiceRequests'
import { RecentActivities } from './components/RecentActivities'
import { EquipmentSummary } from './components/EquipmentSummary'
import { QuickActions } from './components/QuickActions'

export function EngineerDashboardPage() {
  const { t } = useTranslation('engineer')

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-display text-primary">{t('dashboard.title')}</h1>
      </div>

      {/* Top Stats */}
      <EngineerDashboardStats />

      {/* Main Grid: Charts & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Main Column - spans 2 cols on lg screens */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <EngineerPerformanceChart />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ServiceRequestStatusChart />
            <EquipmentSummary />
          </div>
          <RecentServiceRequests />
        </div>

        {/* Right/Side Column */}
        <div className="flex flex-col gap-6">
          <QuickActions />
          <RecentActivities />
        </div>
      </div>
    </div>
  )
}
