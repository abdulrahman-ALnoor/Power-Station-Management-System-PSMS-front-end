import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/hooks/useLanguage'
import { EquipmentStats } from './components/EquipmentStats'
import { EquipmentToolbar } from './components/EquipmentToolbar'
import { EquipmentTable } from './components/EquipmentTable'
import { EquipmentDetailsDrawer } from './components/EquipmentDetailsDrawer'
import { AddEquipmentModal } from './components/AddEquipmentModal'
import { MOCK_EQUIPMENT } from './data/mockData'

export function EquipmentManagementPage() {
  const { t } = useTranslation('equipment')
  const { isRTL } = useLanguage()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Laravel $table->id() is numeric.
  // Keep the frontend ID type consistent with the backend.
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<number | null>(null)

  const selectedEquipment =
    selectedEquipmentId !== null
      ? MOCK_EQUIPMENT.find(
          (equipment) => equipment.id === selectedEquipmentId
        ) ?? null
      : null

  return (
    <>
      <div className="space-y-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-start">
            <h1 className="font-headline-md text-headline-md font-bold text-primary dark:text-on-dark">
              {t('pageTitle')}
            </h1>
          </div>
        </div>

        {/* Statistics */}
        <EquipmentStats />

        {/* Toolbar */}
        <EquipmentToolbar
          onAddClick={() => setIsAddModalOpen(true)}
        />

        {/* Equipment Table */}
        <EquipmentTable
          onRowClick={(id: number) => {
            setSelectedEquipmentId(id)
          }}
        />
      </div>

      {/* Equipment Details Drawer */}
      <EquipmentDetailsDrawer
        equipment={selectedEquipment}
        isOpen={selectedEquipmentId !== null}
        onClose={() => setSelectedEquipmentId(null)}
      />

      {/* Add Equipment Modal */}
      <AddEquipmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  )
}