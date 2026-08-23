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
import { fetchEmployee, mapEmployee } from '@/services/employees.service'
import { Employee } from './types'

export default function EmployeesPage() {
 const { t } = useTranslation('employees')
 const { isRTL } = useLanguage()

 const [isAddModalOpen, setIsAddModalOpen] = useState(false)
 const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const handleViewEmployee = (id: string) => {
    fetchEmployee(id)
      .then((raw) => setSelectedEmployee(mapEmployee(raw)))
      .catch(() => setSelectedEmployee(null))
  }

  const handleEmployeeCreated = () => {
    setIsAddModalOpen(false)
    setRefreshKey((k) => k + 1)
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center gap-2">
        <nav className="flex items-center text-on-surface-variant font-label-sm text-label-sm ms-4">
          <span>{t('breadcrumbs.home')}</span>
          {isRTL ? (
            <ChevronLeft size={16} className="mx-1" />
          ) : (
            <ChevronRight size={16} className="mx-1" />
          )}
          <span className="text-primary font-bold dark:text-primary-fixed">{t('breadcrumbs.employees')}</span>
        </nav>
        <h1 className="font-headline-md text-headline-md text-primary font-bold border-s-4 border-bright-gold ps-3 dark:text-on-dark">
          {t('pageTitle')}
        </h1>
      </div>

      <div className="space-y-6">

        <EmployeeStats key={`stats-${refreshKey}`} />

        <EmployeeToolbar
          onAddClick={() => setIsAddModalOpen(true)}
          search={search}
          onSearchChange={setSearch}
          role={role}
          onRoleChange={setRole}
          status={status}
          onStatusChange={setStatus}
          onRefresh={() => setRefreshKey((k) => k + 1)}
        />

        <EmployeeTable
          onViewClick={handleViewEmployee}
          search={search}
          role={role}
          status={status}
          refreshKey={refreshKey}
          onDeleted={() => setRefreshKey((k) => k + 1)}
        />

        <PermissionsOverview />

 </div>

      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreated={handleEmployeeCreated}
      />

      <EmployeePreviewDrawer
        employee={selectedEmployee}
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />

 </div>
 )
}
