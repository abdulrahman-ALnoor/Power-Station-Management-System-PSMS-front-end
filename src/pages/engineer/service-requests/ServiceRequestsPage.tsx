import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { ServiceRequestStats } from '../../shared/service-requests/components/ServiceRequestStats'
import { ServiceRequestToolbar } from '../../shared/service-requests/components/ServiceRequestToolbar'
import { ServiceRequestTable } from '../../shared/service-requests/components/ServiceRequestTable'
import { ServiceRequestDetailsDrawer } from '../../shared/service-requests/components/ServiceRequestDetailsDrawer'
import { ServiceRequestModal } from '../../shared/service-requests/components/ServiceRequestModal'
import { serviceRequestService, GetServiceRequestsParams } from '../../../services/shared/serviceRequestService'
import { ServiceRequest } from '../../shared/service-requests/types'
import { Pagination } from '@/components/ui/Pagination'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'

class ServiceRequestsErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
 constructor(props: { children: React.ReactNode }) {
 super(props)
 this.state = { hasError: false, error: null }
 }
 static getDerivedStateFromError(error: Error) {
 return { hasError: true, error }
 }
 render() {
 if (this.state.hasError) {
 return (
 <div style={{ padding: '40px', background: 'white', color: 'red', direction: 'ltr' }}>
 <h2>Service Request UI Error</h2>
 <pre>{this.state.error?.message}</pre>
 <pre style={{ fontSize: '12px' }}>{this.state.error?.stack}</pre>
 </div>
 )
 }
 return this.props.children
 }
}

export function ServiceRequestsPage() {
 return (
 <ServiceRequestsErrorBoundary>
 <ServiceRequestsPageContent />
 </ServiceRequestsErrorBoundary>
 )
}

function ServiceRequestsPageContent() {
 const { t } = useTranslation('engineer')
 const { isRTL } = useLanguage()

 const [isLoading, setIsLoading] = useState(true)
 const [error, setError] = useState<string | null>(null)
 
 const [data, setData] = useState<ServiceRequest[]>([])
 const [total, setTotal] = useState(0)
 const [currentPage, setCurrentPage] = useState(1)
 const [lastPage, setLastPage] = useState(1)

 const [filters, setFilters] = useState<GetServiceRequestsParams>({
 page: 1,
 per_page: 10,
 search: '',
 status: 'all',
 request_type: 'all',
 priority: 'all',
 assigned_to: 'all',
 })

 const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null)
 const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

 const fetchRequests = async (currentFilters: GetServiceRequestsParams) => {
 setIsLoading(true)
 setError(null)
 try {
 const response = await serviceRequestService.getServiceRequests(currentFilters)
 setData(response.data)
 setTotal(response.total)
 setCurrentPage(response.current_page)
 setLastPage(response.last_page)
 } catch (err) {
 setError(t('serviceRequests.errorState'))
 } finally {
 setIsLoading(false)
 }
 }

 useEffect(() => {
 fetchRequests(filters)
 }, [filters])

 const handleFilterChange = (newFilters: GetServiceRequestsParams) => {
 setFilters(newFilters)
 }

 const handlePageChange = (page: number) => {
 setFilters({ ...filters, page })
 }

 const handleViewDetails = (request: ServiceRequest) => {
 setSelectedRequest(request)
 }

 const handleStartExecution = async (request: ServiceRequest) => {
 try {
 if (request.status === 'pending') {
 // Just as an example workflow: pending -> assigned -> in_progress
 // Real logic depends on if they self-assign first or jump to in_progress.
 // Assuming starting execution moves it straight to in_progress if allowed.
 await serviceRequestService.updateServiceRequestStatus(request.id, 'in_progress')
 } else if (request.status === 'assigned') {
 await serviceRequestService.updateServiceRequestStatus(request.id, 'in_progress')
 }
 fetchRequests(filters)
 } catch (err) {
 console.error(err)
 }
 }

 const handleCompleteRequest = async (request: ServiceRequest) => {
 try {
 await serviceRequestService.updateServiceRequestStatus(request.id, 'completed')
 fetchRequests(filters)
 } catch (err) {
 console.error(err)
 }
 }

 const handleStatusUpdate = async (requestId: number, newStatus: string) => {
 await serviceRequestService.updateServiceRequestStatus(requestId, newStatus as any)
 
 // Update local selected request state if drawer is open
 if (selectedRequest && selectedRequest.id === requestId) {
 setSelectedRequest({ ...selectedRequest, status: newStatus as any })
 }
 
 fetchRequests(filters)
 }

 const handleAssignToMe = async (requestId: number) => {
 const updated = await serviceRequestService.assignServiceRequestToMe(requestId)
 
 // Update local selected request state if drawer is open
 if (selectedRequest && selectedRequest.id === requestId) {
 setSelectedRequest(updated)
 }
 
 fetchRequests(filters)
 }

 return (
 <div className="space-y-6 max-w-[1600px] mx-auto w-full">
 {/* Page Header */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div>
 <h1 className="font-headline-sm text-headline-sm font-bold text-primary ">
 {t('serviceRequests.title')}
 </h1>
 <p className="text-text-muted text-sm mt-1">
 {t('serviceRequests.breadcrumb')}
 </p>
 </div>
 <Button
 onClick={() => setIsCreateModalOpen(true)}
 className={cn("flex items-center gap-2", isRTL ? "flex-row-reverse" : "flex-row")}
 >
 <Plus size={18} />
 <span>{t('serviceRequests.createRequest')}</span>
 </Button>
 </div>

 {/* Stats */}
 <ServiceRequestStats requests={data} />

 {/* Error State */}
 {error && (
 <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 flex justify-between items-center">
 <span>{error}</span>
 <Button variant="outline" size="sm" onClick={() => fetchRequests(filters)}>Retry</Button>
 </div>
 )}

 {/* Toolbar */}
 <ServiceRequestToolbar filters={filters} onFilterChange={handleFilterChange} />

 {/* Table */}
 <ServiceRequestTable
 data={data}
 isLoading={isLoading}
 onViewDetails={handleViewDetails}
 onStartExecution={handleStartExecution}
 onCompleteRequest={handleCompleteRequest}
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
 {selectedRequest && (
 <ServiceRequestDetailsDrawer
 request={selectedRequest}
 onClose={() => setSelectedRequest(null)}
 />
 )}

 {/* Create Modal */}
 <ServiceRequestModal
 isOpen={isCreateModalOpen}
 onClose={() => setIsCreateModalOpen(false)}
 onSuccess={() => {
 fetchRequests(filters) // Refresh list on success
 }}
 />

 </div>
 )
}
