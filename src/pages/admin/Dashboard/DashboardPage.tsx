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

// Import Modals (using existing, plus placeholders for new ones we will create)
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

  useEffect(() => {
    document.title = `${t('title')} | PSMS`
  }, [t])

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

  return (
    <>
      <div className="flex flex-col animate-in fade-in duration-500">
        <DashboardStats />
        <DashboardCharts />
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          <QuickActions onActionSelect={handleActionSelect} />
          <EquipmentStatus />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <LatestServiceRequests />
          <LatestReadings />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <RecentCollections />
          <SystemNotifications />
        </div>
      </div>
      
      {/* Render Modals based on activeAction */}
      <AddEmployeeModal 
        isOpen={activeAction === 'addEmployee'} 
        onClose={handleCloseModal} 
      />
      <AddMeterModal 
        isOpen={activeAction === 'addMeter'} 
        onClose={handleCloseModal} 
      />
      <AddMeterReadingModal 
        isOpen={activeAction === 'addReading'} 
        onClose={handleCloseModal}
        onAdd={(reading) => {
          console.log('Reading Added from Dashboard:', reading)
          handleCloseModal()
        }}
      />
      <AddEquipmentModal 
        isOpen={activeAction === 'addEquipment'} 
        onClose={handleCloseModal} 
      />
      <AddCustomerModal
        isOpen={activeAction === 'addCustomer'}
        onClose={handleCloseModal}
        onAdd={(data) => {
          console.log('Customer Added from Dashboard:', data)
          handleCloseModal()
        }}
      />
      <AddServiceRequestModal
        isOpen={activeAction === 'requestService'}
        onClose={handleCloseModal}
        onAdd={(data) => {
          console.log('Service Request Added from Dashboard:', data)
          handleCloseModal()
        }}
      />
      <AddInvoiceModal
        isOpen={activeAction === 'createInvoice'}
        onClose={handleCloseModal}
        onAdd={(data) => {
          console.log('Invoice Added from Dashboard:', data)
          handleCloseModal()
        }}
      />
    </>
  )
}
