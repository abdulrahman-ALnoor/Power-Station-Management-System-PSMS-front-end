import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MeterStats } from './components/MeterStats'
import { MeterToolbar } from './components/MeterToolbar'
import { MeterTable } from './components/MeterTable'
import { MeterDetailsDrawer } from './components/MeterDetailsDrawer'
import { AddMeterModal } from './components/AddMeterModal'
import { fetchMeterById, mapMeter } from '@/services/meters.service'
import type { Meter } from './types'

export default function MetersPage() {
  const { t } = useTranslation('meters')

  // Toolbar filters
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  // Forces MeterTable + MeterStats to refetch
  const [refreshKey, setRefreshKey] = useState(0)
  const triggerRefresh = () => setRefreshKey((k) => k + 1)

  // Details drawer
  const [selectedMeter, setSelectedMeter] = useState<Meter | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isDrawerLoading, setIsDrawerLoading] = useState(false)

  // Add/Edit modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMeter, setEditingMeter] = useState<Meter | null>(null)

  const openDrawer = async (id: number) => {
    setIsDrawerOpen(true)
    setIsDrawerLoading(true)
    try {
      const raw = await fetchMeterById(id)
      setSelectedMeter(mapMeter(raw))
    } catch {
      setIsDrawerOpen(false)
      window.alert(t('errors.loadDetailsFailed'))
    } finally {
      setIsDrawerLoading(false)
    }
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedMeter(null)
  }

  const openAddModal = () => {
    setEditingMeter(null)
    setIsModalOpen(true)
  }

  const openEditModal = async (id: number) => {
    setIsDrawerLoading(true)
    try {
      const raw = await fetchMeterById(id)
      setEditingMeter(mapMeter(raw))
      setIsModalOpen(true)
    } catch {
      window.alert(t('errors.loadDetailsFailed'))
    } finally {
      setIsDrawerLoading(false)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingMeter(null)
  }

  const handleSaved = () => {
    triggerRefresh()
  }

  const handleDeleted = () => {
    triggerRefresh()
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-headline-lg text-headline-lg text-primary dark:text-on-dark font-bold">
          {t('title')}
        </h1>
      </div>

      {/* Stats */}
      <MeterStats key={`stats-${refreshKey}`} />

      {/* Table Card */}
      <div className="bg-surface-white dark:bg-surface-container-low rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
        <MeterToolbar
          onAddClick={openAddModal}
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          onRefresh={triggerRefresh}
        />
        <MeterTable
          onRowClick={openDrawer}
          onEditClick={openEditModal}
          search={search}
          status={status}
          refreshKey={refreshKey}
          onDeleted={handleDeleted}
        />
      </div>

      {/* Details Drawer */}
      <MeterDetailsDrawer
        meter={isDrawerLoading ? null : selectedMeter}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
      />

      {/* Add / Edit Modal */}
      <AddMeterModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSaved={handleSaved}
        meter={editingMeter}
      />
    </div>
  )
}
