import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronRight, ChevronLeft } from 'lucide-react'

import { useLanguage } from '@/hooks/useLanguage'

import { EmployeeStats } from './components/EmployeeStats'
import { EmployeeToolbar } from './components/EmployeeToolbar'
import { EmployeeTable } from './components/EmployeeTable'
import { PermissionsOverview } from './components/PermissionsOverview'
import { AddEmployeeModal } from './components/AddEmployeeModal'
import { EmployeePreviewDrawer } from './components/EmployeePreviewDrawer'
import { EditEmployeeModal } from './components/EditEmployeeModal'

import {
  fetchEmployee,
  mapEmployee,
} from '@/services/employees.service'

import type { Employee } from './types'

export default function EmployeesPage() {
  const { t } = useTranslation('employees')
  const { isRTL } = useLanguage()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null)

  const [editingEmployee, setEditingEmployee] =
    useState<Employee | null>(null)

  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')

  const [refreshKey, setRefreshKey] = useState(0)

  // عرض الموظف
  const handleViewEmployee = async (id: string) => {
    try {
      const raw = await fetchEmployee(id)

      setSelectedEmployee(mapEmployee(raw))
    } catch (error) {
      console.error('تعذر تحميل بيانات الموظف', error)
      setSelectedEmployee(null)
    }
  }

  // فتح نافذة التعديل
  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(null)

    setEditingEmployee(employee)
  }

  // بعد إضافة موظف
  const handleEmployeeCreated = () => {
    setIsAddModalOpen(false)

    setRefreshKey((key) => key + 1)
  }

  // بعد تعديل موظف
  const handleEmployeeUpdated = () => {
    setEditingEmployee(null)

    setRefreshKey((key) => key + 1)
  }

  // بعد حذف موظف
  const handleEmployeeDeleted = () => {
    setRefreshKey((key) => key + 1)
  }

  return (
    <div className="space-y-6">

      {/* العنوان */}
      <div className="flex items-center gap-2">

        <nav className="flex items-center text-on-surface-variant font-label-sm text-label-sm ms-4">

          <span>
            {t('breadcrumbs.home')}
          </span>

          {isRTL ? (
            <ChevronLeft
              size={16}
              className="mx-1"
            />
          ) : (
            <ChevronRight
              size={16}
              className="mx-1"
            />
          )}

          <span className="text-primary font-bold dark:text-primary-fixed">
            {t('breadcrumbs.employees')}
          </span>

        </nav>

        <h1 className="font-headline-md text-headline-md text-primary font-bold border-s-4 border-bright-gold ps-3 dark:text-on-dark">
          {t('pageTitle')}
        </h1>

      </div>

      <div className="space-y-6">

        {/* الإحصائيات */}
        <EmployeeStats
          key={`stats-${refreshKey}`}
        />

        {/* البحث والإضافة */}
        <EmployeeToolbar
          onAddClick={() =>
            setIsAddModalOpen(true)
          }

          search={search}
          onSearchChange={setSearch}

          role={role}
          onRoleChange={setRole}

          status={status}
          onStatusChange={setStatus}

          onRefresh={() =>
            setRefreshKey((key) => key + 1)
          }
        />

        {/* جدول الموظفين */}
        <EmployeeTable
          onViewClick={handleViewEmployee}

          onEditClick={handleEditEmployee}

          search={search}

          role={role}

          status={status}

          refreshKey={refreshKey}

          onDeleted={handleEmployeeDeleted}
        />

        <PermissionsOverview />

      </div>

      {/* نافذة إضافة موظف */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}

        onClose={() =>
          setIsAddModalOpen(false)
        }

        onCreated={handleEmployeeCreated}
      />

      {/* نافذة عرض الموظف */}
      <EmployeePreviewDrawer
        employee={selectedEmployee}

        isOpen={!!selectedEmployee}

        onClose={() =>
          setSelectedEmployee(null)
        }
      />

      {/* نافذة تعديل الموظف */}
      <EditEmployeeModal
        employee={editingEmployee}

        isOpen={!!editingEmployee}

        onClose={() =>
          setEditingEmployee(null)
        }

        onUpdated={handleEmployeeUpdated}
      />

    </div>
  )
}