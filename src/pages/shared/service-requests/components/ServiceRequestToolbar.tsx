import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import { GetServiceRequestsParams } from '../../../../services/shared/serviceRequestService'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'

interface ServiceRequestToolbarProps {
 filters: GetServiceRequestsParams
 onFilterChange: (filters: GetServiceRequestsParams) => void
 hideAssignmentFilter?: boolean
}

export function ServiceRequestToolbar({ filters, onFilterChange, hideAssignmentFilter }: ServiceRequestToolbarProps) {
 const { t } = useTranslation('engineer')
 const { isRTL } = useLanguage()

 const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
 onFilterChange({ ...filters, search: e.target.value, page: 1 })
 }

 const handleSelect = (key: keyof GetServiceRequestsParams, value: string) => {
 onFilterChange({ ...filters, [key]: value, page: 1 })
 }

 return (
 <div className="bg-surface p-4 rounded-xl border border-border shadow-sm flex flex-col gap-4">
 <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", hideAssignmentFilter ? "lg:grid-cols-4" : "lg:grid-cols-5")}>
 {/* Search Input */}
 <div className="relative col-span-1 lg:col-span-1">
 <div className={cn("absolute inset-y-0 flex items-center pointer-events-none text-text-muted", isRTL ? "right-3" : "left-3")}>
 <Search size={18} />
 </div>
 <input
 type="text"
 className={cn(
 "w-full bg-[var(--color-surface-container-lowest)] border border-border rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-text",
 isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
 )}
 placeholder={t('serviceRequests.searchPlaceholder')}
 value={filters.search || ''}
 onChange={handleSearch}
 />
 </div>

 {/* Status Filter */}
 <div>
 <select
 className="w-full bg-[var(--color-surface-container-lowest)] border border-border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-text appearance-none"
 value={filters.status || 'all'}
 onChange={(e) => handleSelect('status', e.target.value)}
 >
 <option value="all">{t('serviceRequests.filters.statusOptions.all')}</option>
 <option value="pending">{t('serviceRequests.status.pending')}</option>
 <option value="assigned">{t('serviceRequests.status.assigned')}</option>
 <option value="in_progress">{t('serviceRequests.status.in_progress')}</option>
 <option value="completed">{t('serviceRequests.status.completed')}</option>
 <option value="cancelled">{t('serviceRequests.status.cancelled')}</option>
 </select>
 </div>

 {/* Request Type Filter */}
 <div>
 <select
 className="w-full bg-[var(--color-surface-container-lowest)] border border-border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-text appearance-none"
 value={filters.request_type || 'all'}
 onChange={(e) => handleSelect('request_type', e.target.value)}
 >
 <option value="all">{t('serviceRequests.filters.typeOptions.all')}</option>
 <option value="new_connection">{t('serviceRequests.type.new_connection')}</option>
 <option value="maintenance">{t('serviceRequests.type.maintenance')}</option>
 <option value="disconnection">{t('serviceRequests.type.disconnection')}</option>
 </select>
 </div>

 {/* Priority Filter */}
 <div>
 <select
 className="w-full bg-[var(--color-surface-container-lowest)] border border-border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-text appearance-none"
 value={filters.priority || 'all'}
 onChange={(e) => handleSelect('priority', e.target.value)}
 >
 <option value="all">{t('serviceRequests.filters.priorityOptions.all')}</option>
 <option value="low">{t('serviceRequests.priority.low')}</option>
 <option value="medium">{t('serviceRequests.priority.medium')}</option>
 <option value="high">{t('serviceRequests.priority.high')}</option>
 <option value="emergency">{t('serviceRequests.priority.emergency')}</option>
 </select>
 </div>

 {/* Engineer Assignment Filter */}
 {!hideAssignmentFilter && (
 <div>
 <select
 className="w-full bg-[var(--color-surface-container-lowest)] border border-border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-text appearance-none"
 value={filters.assigned_to || 'all'}
 onChange={(e) => handleSelect('assigned_to', e.target.value)}
 >
 <option value="all">{t('serviceRequests.filters.engineerOptions.all')}</option>
 <option value="me">{t('serviceRequests.filters.engineerOptions.me')}</option>
 <option value="unassigned">{t('serviceRequests.filters.engineerOptions.unassigned')}</option>
 </select>
 </div>
 )}
 </div>
 </div>
 )
}


