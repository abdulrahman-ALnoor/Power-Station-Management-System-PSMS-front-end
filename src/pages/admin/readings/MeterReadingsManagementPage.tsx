import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/hooks/useLanguage'
import { MeterReading } from './types'
import { fetchReadingById, mapMeterReading } from '@/services/meterReadings.service'
import { MeterReadingStats } from './components/MeterReadingStats'
import { MeterReadingToolbar } from './components/MeterReadingToolbar'
import { MeterReadingTable } from './components/MeterReadingTable'
import { MeterReadingDetailsDrawer } from './components/MeterReadingDetailsDrawer'
import { AddMeterReadingModal } from './components/AddMeterReadingModal'

export function MeterReadingsManagementPage() {
  const { t } = useTranslation('readings')
  const { isRTL } = useLanguage()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [thisMonthOnly, setThisMonthOnly] = useState(false)

  const [refreshKey, setRefreshKey] = useState(0)
  const triggerRefresh = () => setRefreshKey((k) => k + 1)

  const [selectedReading, setSelectedReading] = useState<MeterReading | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingReading, setEditingReading] = useState<MeterReading | null>(null)

  const handleViewDetails = (reading: MeterReading) => {
    setSelectedReading(reading)
    setIsDetailsOpen(true)
  }

  const openAddModal = () => {
    setEditingReading(null)
    setIsModalOpen(true)
  }

  const openEditModal = async (reading: MeterReading) => {
    try {
      const raw = await fetchReadingById(reading.id)
      setEditingReading(mapMeterReading(raw))
      setIsModalOpen(true)
    } catch {
      window.alert(t('errors.loadDetailsFailed'))
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingReading(null)
  }

  const handleSaved = () => {
    triggerRefresh()
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-start">
          <h1 className="font-headline-md text-headline-md font-bold text-primary dark:text-on-dark">
            {t('pageTitle')}
          </h1>
          <p className="text-label-md text-outline dark:text-outline/80 mt-1">
            {t('pageSubtitle')}
          </p>
          <nav
            className="flex gap-2 text-label-sm text-outline/60 dark:text-outline/50 mt-2"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <span>{t('breadcrumb.home')}</span>
            <span>/</span>
            <span>{t('breadcrumb.readings')}</span>
          </nav>
        </div>
      </div>

      <MeterReadingStats refreshKey={refreshKey} />

      <MeterReadingToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        thisMonthOnly={thisMonthOnly}
        onThisMonthOnlyChange={setThisMonthOnly}
        onAddClick={openAddModal}
        onRefresh={triggerRefresh}
      />

      <MeterReadingTable
        onViewDetails={handleViewDetails}
        onEdit={openEditModal}
        search={searchQuery}
        status={statusFilter === 'all' ? undefined : statusFilter}
        thisMonthOnly={thisMonthOnly}
        refreshKey={refreshKey}
        onChanged={triggerRefresh}
      />

      <MeterReadingDetailsDrawer
        reading={selectedReading}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />

      <AddMeterReadingModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSaved={handleSaved}
        reading={editingReading}
      />
    </div>
  )
}
