import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { MeterStats } from './components/MeterStats'
import { MeterToolbar } from './components/MeterToolbar'
import { MeterTable } from './components/MeterTable'
import { MeterDetailsDrawer } from './components/MeterDetailsDrawer'
import { AddMeterModal } from './components/AddMeterModal'
import { MOCK_METERS } from './data/mockData'

export default function MetersPage() {
  const { t } = useTranslation('meters')
  
  // Local state for UI interactions
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedMeterId, setSelectedMeterId] = useState<number | null>(null)
  
  const selectedMeter = useMemo(() => {
    return MOCK_METERS.find(m => m.id === selectedMeterId) || null
  }, [selectedMeterId])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex gap-2 text-label-sm text-on-surface-variant dark:text-outline mb-1">
            <span>{t('breadcrumb.home')}</span>
            <span>/</span>
            <span className="text-primary dark:text-on-dark font-semibold">{t('breadcrumb.meters')}</span>
          </nav>
          <h1 className="font-headline-md text-headline-md text-primary dark:text-on-dark">
            {t('title')}
          </h1>
        </div>
      </div>

      {/* Stats Cards */}
      <MeterStats />

      {/* Workspace (Toolbar + Table) */}
      <div className="bg-surface-white dark:bg-surface-container-low rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
        <MeterToolbar onAddClick={() => setIsAddModalOpen(true)} />
        <MeterTable onRowClick={(id) => setSelectedMeterId(id)} />
      </div>

      {/* Drawers & Modals */}
      <MeterDetailsDrawer 
        meter={selectedMeter} 
        isOpen={selectedMeterId !== null} 
        onClose={() => setSelectedMeterId(null)} 
      />
      
      <AddMeterModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  )
}
