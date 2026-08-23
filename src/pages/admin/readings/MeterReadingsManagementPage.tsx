import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/hooks/useLanguage'
import { MeterReading } from './types'
import { fetchReadingById, mapMeterReading } from '@/services/meterReadings.service'
import { MeterReadingStats } from './components/MeterReadingStats'
import { MeterReadingToolbar } from './components/MeterReadingToolbar'
import { MeterReadingTable } from './components/MeterReadingTable'
import { MeterReadingDetailsDrawer } from './components/MeterReadingDetailsDrawer'
import { AddMeterReadingModal } from './components/AddMeterReadingModal'
import { ChangeReadingStatusModal } from './components/ChangeReadingStatusModal'
import { readingService, GetReadingsParams } from '../../../services/shared/readingService'
import { Pagination } from '@/components/ui/Pagination'
import { ReadingStatus } from '../../shared/readings/types'


export function MeterReadingsManagementPage() {
 const { t } = useTranslation('readings')
 const { isRTL } = useLanguage()

const [isLoading, setIsLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

const [data, setData] = useState<MeterReading[]>([])
const [total, setTotal] = useState(0)
const [currentPage, setCurrentPage] = useState(1)
const [lastPage, setLastPage] = useState(1)

const [filters, setFilters] = useState<GetReadingsParams>({
  page: 1,
  per_page: 10,
  search: '',
  status: 'all',
  method: 'all',
  date: 'all',
})

const [searchQuery, setSearchQuery] = useState('')
const [statusFilter, setStatusFilter] = useState('all')
const [thisMonthOnly, setThisMonthOnly] = useState(false)

const [refreshKey, setRefreshKey] = useState(0)

const triggerRefresh = () => {
  setRefreshKey((k) => k + 1)
}

const [selectedReading, setSelectedReading] = useState<MeterReading | null>(null)
const [readingToEdit, setReadingToEdit] = useState<MeterReading | undefined>()
const [readingToDelete, setReadingToDelete] = useState<MeterReading | null>(null)
const [readingToChangeStatus, setReadingToChangeStatus] =
  useState<MeterReading | null>(null)

const [isDetailsOpen, setIsDetailsOpen] = useState(false)
const [isModalOpen, setIsModalOpen] = useState(false)
const [isAddModalOpen, setIsAddModalOpen] = useState(false)
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)

const [editingReading, setEditingReading] =
  useState<MeterReading | null>(null)

const [notification, setNotification] = useState<{
  type: 'success' | 'error'
  message: string
} | null>(null)

 const fetchReadings = async (currentFilters: GetReadingsParams) => {
 setIsLoading(true)
 setError(null)
 try {
 const response = await readingService.getReadings(currentFilters)
 setData(response.data)
 setTotal(response.total)
 setCurrentPage(response.current_page)
 setLastPage(response.last_page)
 } catch (err) {
 setError('حدث خطأ أثناء جلب البيانات')
 } finally {
 setIsLoading(false)
 }
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

const handleViewDetails = (reading: MeterReading) => {
  setSelectedReading(reading)
  setIsDetailsOpen(true)
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

    {/* Statistics */}
    <MeterReadingStats refreshKey={refreshKey} />

    {/* Toolbar */}
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

    {/* Table */}
    <MeterReadingTable
      onViewDetails={handleViewDetails}
      onEdit={openEditModal}
      search={searchQuery}
      status={statusFilter === 'all' ? undefined : statusFilter}
      thisMonthOnly={thisMonthOnly}
      refreshKey={refreshKey}
      onChanged={triggerRefresh}
    />

    {/* Details Drawer */}
    <MeterReadingDetailsDrawer
      reading={selectedReading}
      isOpen={isDetailsOpen}
      onClose={() => setIsDetailsOpen(false)}
    />

    {/* Add / Edit Modal */}
    <AddMeterReadingModal
      isOpen={isModalOpen}
      onClose={closeModal}
      onSaved={handleSaved}
      reading={editingReading}
    />
  </div>
)}
