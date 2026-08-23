import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/hooks/useLanguage'
import { EquipmentStats } from './components/EquipmentStats'
import { EquipmentToolbar } from './components/EquipmentToolbar'
import { EquipmentTable } from './components/EquipmentTable'
import { EquipmentDetailsDrawer } from './components/EquipmentDetailsDrawer'
import { AddEquipmentModal } from './components/AddEquipmentModal'
import { fetchEquipmentById, mapEquipment } from '@/services/equipment.service'
import type { Equipment } from './types'

export function EquipmentManagementPage() {
 const { t } = useTranslation('equipment')
 const { isRTL } = useLanguage()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<number | null>(null)

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRowClick = (id: number) => {
    setSelectedEquipmentId(id)
    fetchEquipmentById(id)
      .then((raw) => setSelectedEquipment(mapEquipment(raw)))
      .catch(() => setSelectedEquipment(null))
  }

  const handleCreated = () => {
    setIsAddModalOpen(false)
    setRefreshKey((k) => k + 1)
  }

 return (
 <>
 <div className="space-y-6">

 {/* Header Section */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div className="text-start">
 <h1 className="font-headline-md text-headline-md font-bold text-primary ">
 {t('pageTitle')}
 </h1>
 </div>
 </div>

 {/* Statistics */}
 <EquipmentStats />

        {/* Statistics */}
        <EquipmentStats key={`stats-${refreshKey}`} />

        {/* Toolbar */}
        <EquipmentToolbar
          onAddClick={() => setIsAddModalOpen(true)}
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          onRefresh={() => setRefreshKey((k) => k + 1)}
        />

        {/* Equipment Table */}
        <EquipmentTable
          onRowClick={handleRowClick}
          onEditClick={handleRowClick}
          search={search}
          status={status}
          refreshKey={refreshKey}
          onDeleted={() => setRefreshKey((k) => k + 1)}
        />
      </div>

      {/* Equipment Details Drawer */}
      <EquipmentDetailsDrawer
        equipment={selectedEquipment}
        isOpen={selectedEquipmentId !== null}
        onClose={() => {
          setSelectedEquipmentId(null)
          setSelectedEquipment(null)
        }}
      />

      {/* Add Equipment Modal */}
      <AddEquipmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreated={handleCreated}
      />
    </>
  )
}
