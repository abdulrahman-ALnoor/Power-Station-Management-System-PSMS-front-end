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
import { MOCK_EMPLOYEES } from './data/mockData'
import { Employee } from './types'

export default function EmployeesPage() {
  const { t } = useTranslation('employees')
  const { isRTL } = useLanguage()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  const handleViewEmployee = (id: string) => {
    const employee = MOCK_EMPLOYEES.find(e => e.id === id)
    if (employee) {
      setSelectedEmployee(employee)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Page Header Area (matches Dashboard's layout) */}
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

      {/* Main Content Sections */}
      <div className="space-y-6">
        
        {/* Top Stats */}
        <EmployeeStats />

        {/* Toolbar */}
        <EmployeeToolbar onAddClick={() => setIsAddModalOpen(true)} />

        {/* Data Table */}
        <EmployeeTable onViewClick={handleViewEmployee} />

        {/* Permissions Guide */}
        <PermissionsOverview />

      </div>

      {/* Modals & Drawers */}
      <AddEmployeeModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      
      <EmployeePreviewDrawer 
        employee={selectedEmployee} 
        isOpen={!!selectedEmployee} 
        onClose={() => setSelectedEmployee(null)} 
      />

    </div>
  )
}
