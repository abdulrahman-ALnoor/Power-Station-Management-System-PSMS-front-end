import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useLanguage } from '@/hooks/useLanguage'

import { EquipmentStats } from './components/EquipmentStats'
import { EquipmentToolbar } from './components/EquipmentToolbar'
import { EquipmentTable } from './components/EquipmentTable'
import { EquipmentDetailsDrawer } from './components/EquipmentDetailsDrawer'
import { EquipmentEditModal } from './components/EquipmentEditModal'
import { AddEquipmentModal } from './components/AddEquipmentModal'

import {
  fetchEquipmentById,
  mapEquipment,
} from '@/services/equipment.service'

import type { Equipment } from './types'

export function EquipmentManagementPage() {
 const { t } = useTranslation('equipment')
 const { isRTL } = useLanguage()

  // نافذة الإضافة
  const [isAddModalOpen, setIsAddModalOpen] =
    useState(false)

  // نافذة التفاصيل
  const [isDetailsOpen, setIsDetailsOpen] =
    useState(false)

  // نافذة التعديل
  const [isEditModalOpen, setIsEditModalOpen] =
    useState(false)

  // المعدة المحددة
  const [selectedEquipment, setSelectedEquipment] =
    useState<Equipment | null>(null)

  // البحث
  const [search, setSearch] =
    useState('')

  // الحالة
  const [status, setStatus] =
    useState('')

  // تحديث البيانات
  const [refreshKey, setRefreshKey] =
    useState(0)

  // =========================
  // فتح التفاصيل
  // =========================

  const handleRowClick = async (id: number) => {
    try {
      const raw =
        await fetchEquipmentById(id)

      const equipment =
        mapEquipment(raw)

      setSelectedEquipment(equipment)

      setIsEditModalOpen(false)
      setIsDetailsOpen(true)
    } catch {
      setSelectedEquipment(null)
    }
  }

  // =========================
  // فتح التعديل
  // =========================

  const handleEditClick = async (id: number) => {
    try {
      const raw =
        await fetchEquipmentById(id)

      const equipment =
        mapEquipment(raw)

      setSelectedEquipment(equipment)

      setIsDetailsOpen(false)
      setIsEditModalOpen(true)
    } catch {
      setSelectedEquipment(null)
    }
  }

  // =========================
  // بعد الإضافة
  // =========================

  const handleCreated = () => {
    setIsAddModalOpen(false)

    setRefreshKey((current) =>
      current + 1,
    )
  }

  // =========================
  // بعد التعديل
  // =========================

  const handleUpdated = (
    updatedEquipment: Equipment,
  ) => {
    setSelectedEquipment(
      updatedEquipment,
    )

    setIsEditModalOpen(false)

    setRefreshKey((current) =>
      current + 1,
    )
  }

  // =========================
  // إغلاق التفاصيل
  // =========================

  const handleCloseDetails = () => {
    setIsDetailsOpen(false)

    setSelectedEquipment(null)
  }

  // =========================
  // إغلاق التعديل
  // =========================

  const handleCloseEdit = () => {
    setIsEditModalOpen(false)

    setSelectedEquipment(null)
  }

 return (
 <>
 <div className="space-y-6">

{/* Header */}
<div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
  <div className="text-start">
    <h1 className="font-headline-md text-headline-md font-bold text-primary dark:text-on-dark">
      {t('pageTitle')}
    </h1>

    <nav
      className="mt-1 flex gap-2 text-label-sm text-outline"
      dir={isRTL ? 'rtl' : 'ltr'}
      aria-label={t('breadcrumb.equipment')}
    >
      <span>
        {t('breadcrumb.home')}
      </span>

      <span>/</span>

      <span>
        {t('breadcrumb.equipment')}
      </span>
    </nav>
  </div>
</div>

{/* Statistics */}
<EquipmentStats />

        {/* الإحصائيات */}
        <EquipmentStats
          key={`stats-${refreshKey}`}
        />

        {/* الأدوات */}
        <EquipmentToolbar
          onAddClick={() =>
            setIsAddModalOpen(true)
          }
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          onRefresh={() =>
            setRefreshKey(
              (current) => current + 1,
            )
          }
        />

        {/* الجدول */}
        <EquipmentTable
          onRowClick={handleRowClick}
          onEditClick={handleEditClick}
          search={search}
          status={status}
          refreshKey={refreshKey}
          onDeleted={() =>
            setRefreshKey(
              (current) => current + 1,
            )
          }
        />

      </div>

      {/* ========================= */}
      {/* نافذة التفاصيل */}
      {/* ========================= */}

      <EquipmentDetailsDrawer
        equipment={selectedEquipment}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
      />

      {/* ========================= */}
      {/* نافذة التعديل */}
      {/* ========================= */}

      <EquipmentEditModal
        equipment={selectedEquipment}
        isOpen={isEditModalOpen}
        onClose={handleCloseEdit}
        onUpdated={handleUpdated}
      />

      {/* ========================= */}
      {/* نافذة إضافة المعدة */}
      {/* ========================= */}

      <AddEquipmentModal
        isOpen={isAddModalOpen}
        onClose={() =>
          setIsAddModalOpen(false)
        }
        onCreated={handleCreated}
      />

    </>
  )
}