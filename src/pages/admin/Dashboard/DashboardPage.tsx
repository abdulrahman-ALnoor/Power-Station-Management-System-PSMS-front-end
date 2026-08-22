import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { DashboardStats } from './components/DashboardStats'
import { DashboardCharts } from './components/DashboardCharts'
import { QuickActions, QuickActionType } from './components/QuickActions'
import { EquipmentStatus } from './components/EquipmentStatus'
import { LatestServiceRequests } from './components/LatestServiceRequests'
import { LatestReadings } from './components/LatestReadings'
import { RecentCollections } from './components/RecentCollections'
import { SystemNotifications } from './components/SystemNotifications'
import { fetchDashboard, type DashboardData } from '@/services/dashboard.service.ts'

// Import Modals
import { AddEmployeeModal } from '../employees/components/AddEmployeeModal'
import { AddMeterModal } from '../meters/components/AddMeterModal'
import { AddMeterReadingModal } from '../readings/components/AddMeterReadingModal'
import { AddEquipmentModal } from '../equipment/components/AddEquipmentModal'
import { AddCustomerModal } from '../customers/components/AddCustomerModal'
import { AddServiceRequestModal } from '../service-requests/components/AddServiceRequestModal'
import { AddInvoiceModal } from '../invoices/components/AddInvoiceModal'

export default function DashboardPage() {
  const { t } = useTranslation('dashboard')
  const navigate = useNavigate()

  const [activeAction, setActiveAction] = useState<QuickActionType | null>(null)
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Bumped after a quick-action creates something, to refresh the dashboard snapshot
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    document.title = `${t('title')} | PSMS`
  }, [t])

  useEffect(() => {
    let cancelled = false
    
    setIsLoading(true)
    setError(null)
    fetchDashboard()
      .then((res) => {
        if (!cancelled) setData(res)
      })
      .catch(() => {
        if (!cancelled) setError('تعذر تحميل بيانات لوحة التحكم. تأكد من تشغيل الخادم الخلفي.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => { cancelled = true }
  }, [refreshKey])

  const handleActionSelect = (action: QuickActionType) => {
    if (action === 'viewReports') {
      navigate('/admin/readings')
      return
    }

    setActiveAction(action)
  }

  const handleCloseModal = () => {
    setActiveAction(null)
  }

  const handleCreated = () => {
    setActiveAction(null)
    setRefreshKey((k) => k + 1)
  }

  return (
    <>
      <div className="flex flex-col animate-in fade-in duration-500">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-error/10 text-error text-sm">{error}</div>
        )}

        <DashboardStats
          statistics={data?.statistics ?? null}
          equipmentStatus={data?.equipment_status ?? null}
          isLoading={isLoading}
        />
        <DashboardCharts
          monthlyRevenueChart={data?.monthly_revenue_chart ?? null}
          electricityChart={data?.electricity_consumption_chart ?? null}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          <QuickActions onActionSelect={handleActionSelect} />
          <EquipmentStatus data={data?.equipment_status ?? null} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <LatestServiceRequests requests={data?.latest_service_requests ?? []} />
          <LatestReadings readings={data?.latest_readings ?? []} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <RecentCollections invoices={data?.latest_invoices ?? []} />
          <SystemNotifications />
        </div>
      </div>

      {/* Modals triggered from Quick Actions */}
            <AddEmployeeModal
        isOpen={activeAction === 'addEmployee'}
        onClose={handleCloseModal}
        onCreated={handleCreated}
      />

            <AddMeterModal
        isOpen={activeAction === 'addMeter'}
        onClose={handleCloseModal}
        onSaved={handleCreated}
      />

            <AddMeterReadingModal
        isOpen={activeAction === 'addReading'}
        onClose={handleCloseModal}
        onSaved={handleCreated}
      />

            <AddEquipmentModal
        isOpen={activeAction === 'addEquipment'}
        onClose={handleCloseModal}
        onCreated={handleCreated}
      />

            <AddCustomerModal
        isOpen={activeAction === 'addCustomer'}
        onClose={handleCloseModal}
        onAdd={handleCreated}
      />

            <AddServiceRequestModal
        isOpen={activeAction === 'requestService'}
        onClose={handleCloseModal}
        onAdd={() => handleCreated()}
      />

      <AddInvoiceModal
        isOpen={activeAction === 'createInvoice'}
        onClose={handleCloseModal}
        onAdd={() => handleCreated()}
      />
    </>
  )
}
