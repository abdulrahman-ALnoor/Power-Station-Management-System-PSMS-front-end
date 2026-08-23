import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { GetEquipmentParams } from '../../../../services/shared/equipmentService'

interface EquipmentToolbarProps {
 filters: GetEquipmentParams
 onFilterChange: (filters: GetEquipmentParams) => void
}

export function EquipmentToolbar({ filters, onFilterChange }: EquipmentToolbarProps) {
 const { t } = useTranslation('engineer')

 const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 onFilterChange({ ...filters, search: e.target.value, page: 1 })
 }

 const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
 onFilterChange({ ...filters, status: e.target.value, page: 1 })
 }

 return (
 <div className="bg-surface p-4 rounded-xl border border-border shadow-sm flex flex-col md:flex-row gap-3">
 
 {/* Search Input */}
 <div className="flex-1 w-full min-w-[280px]">
 <Input
 type="text"
 placeholder={t('equipment.searchPlaceholder')}
 value={filters.search || ''}
 onChange={handleSearchChange}
 addonStart={<Search size={18} className="text-text-muted" />}
 className=""
 fullWidth
 />
 </div>

 {/* Status Filter */}
 <div className="w-full md:w-[200px] shrink-0">
 <Select
 value={filters.status || 'all'}
 onChange={handleStatusChange}
 className=""
 options={[
 { label: t('equipment.filters.statusOptions.all'), value: 'all' },
 { label: t('equipment.status.available'), value: 'available' },
 { label: t('equipment.status.maintenance'), value: 'maintenance' },
 { label: t('equipment.status.damaged'), value: 'damaged' },
 { label: t('equipment.status.lost'), value: 'lost' },
 ]}
 />
 </div>

 </div>
 )
}
