import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { EquipmentStats } from '../../shared/equipment/components/EquipmentStats'
import { EquipmentToolbar } from '../../shared/equipment/components/EquipmentToolbar'
import { EquipmentTable } from '../../shared/equipment/components/EquipmentTable'
import { EquipmentDetailsDrawer } from '../../shared/equipment/components/EquipmentDetailsDrawer'
import { equipmentService, GetEquipmentParams } from '../../../services/shared/equipmentService'
import { Equipment } from '../../shared/equipment/types'
import { Pagination } from '@/components/ui/Pagination'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/hooks/useLanguage'

export function AccountantEquipmentPage() {
  const { t } = useTranslation('engineer')
  const { isRTL } = useLanguage()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [data, setData] = useState<Equipment[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)

  const [filters, setFilters] = useState<GetEquipmentParams>({
    page: 1,
    per_page: 10,
    search: '',
    status: 'all',
  })

  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const fetchEquipment = async (currentFilters: GetEquipmentParams) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await equipmentService.getEquipment(currentFilters)
      setData(response.data)
      setTotal(response.total)
      setCurrentPage(response.current_page)
      setLastPage(response.last_page)
    } catch (err) {
      setError(t('equipment.errorState'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEquipment(filters)
  }, [filters])

  const handleFilterChange = (newFilters: GetEquipmentParams) => {
    setFilters(newFilters)
  }

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page })
  }

  const handleViewDetails = (equipment: Equipment) => {
    setSelectedEquipment(equipment)
    setIsDrawerOpen(true)
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto w-full pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-sm text-headline-sm font-bold text-text">
            {t('equipment.title') || 'المعدات'}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            إدارة المعدات
          </p>
        </div>
      </div>

      {/* Stats */}
      <EquipmentStats equipment={data} />

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-800 flex justify-between items-center">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={() => fetchEquipment(filters)}>{t('equipment.retry')}</Button>
        </div>
      )}

      {/* Toolbar */}
      <EquipmentToolbar filters={filters} onFilterChange={handleFilterChange} />

      {/* Table */}
      <EquipmentTable
        data={data}
        isLoading={isLoading}
        onRowClick={handleViewDetails}
      />

      {/* Pagination */}
      {!isLoading && data.length > 0 && (
        <Pagination
          meta={{
            currentPage,
            lastPage,
            perPage: filters.per_page || 10,
            total,
          }}
          onPageChange={handlePageChange}
        />
      )}

      {/* Drawer */}
      {/* NOTE: onStatusUpdate is intentionally omitted to disable status editing as per Accountant roles */}
      <EquipmentDetailsDrawer
        equipment={selectedEquipment}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  )
}
