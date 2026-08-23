import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'
import { Plus, X } from 'lucide-react'
import { ServiceRequestStats } from '../../shared/service-requests/components/ServiceRequestStats'
import { ServiceRequestToolbar } from '../../shared/service-requests/components/ServiceRequestToolbar'
import { ServiceRequestTable } from '../../shared/service-requests/components/ServiceRequestTable'
import { ServiceRequestDetailsDrawer } from '../../shared/service-requests/components/ServiceRequestDetailsDrawer'
import { ServiceRequestModal } from '../../shared/service-requests/components/ServiceRequestModal'
import { serviceRequestService, GetServiceRequestsParams, mockCurrentUser } from '../../../services/shared/serviceRequestService'
import { ServiceRequest } from '../../shared/service-requests/types'
import { Pagination } from '@/components/ui/Pagination'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'
import { ConfirmDialog } from '@/components/overlays/ConfirmDialog'

export function ReaderServiceRequestsPage() {
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
 created_by: mockCurrentUser.id,
 })

 const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null)
 const [requestToEdit, setRequestToEdit] = useState<ServiceRequest | undefined>()
 const [requestToDelete, setRequestToDelete] = useState<ServiceRequest | null>(null)
 
 const [isModalOpen, setIsModalOpen] = useState(false)
 const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
 const [isDeleting, setIsDeleting] = useState(false)
 
 const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

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
 setError(t('serviceRequests.errorState', 'حدث خطأ أثناء جلب البيانات'))
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

 const handleDeleteConfirm = async () => {
 if (requestToDelete) {
 setIsDeleting(true)
 try {
 await serviceRequestService.deleteServiceRequest(requestToDelete.id)
 fetchRequests(filters)
 setIsDeleteModalOpen(false)
 setRequestToDelete(null)
 setNotification({ type: 'success', message: isRTL ? 'تم حذف طلب الخدمة بنجاح' : 'Service request deleted successfully' })
 } catch (err) {
 setNotification({ type: 'error', message: isRTL ? 'فشل الحذف' : 'Failed to delete' })
 } finally {
 setIsDeleting(false)
 }
 }
 }

 useEffect(() => {
 if (notification) {
 const timer = setTimeout(() => setNotification(null), 3000)
 return () => clearTimeout(timer)
 }
 }, [notification])

 return (
 <div className="space-y-6 max-w-[1600px] mx-auto w-full pb-12">
 {/* Page Header (No secondary text or breadcrumbs) */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div className="text-start">
 <h1 className="font-headline-md text-headline-md font-bold text-primary ">
 {t('serviceRequests.title', 'طلبات الخدمة')}
 </h1>
 </div>
 <Button
 onClick={() => {
 setRequestToEdit(undefined)
 setIsModalOpen(true)
 }}
 className={cn("flex items-center gap-2", isRTL ? "flex-row-reverse" : "flex-row")}
 >
 <Plus size={18} />
 <span>{t('serviceRequests.createRequest', 'إضافة طلب خدمة')}</span>
 </Button>
 </div>

 {/* Notification Toast */}
 {notification && (
 <div className={`p-4 rounded-xl flex items-center justify-between shadow-sm border ${
 notification.type === 'success' 
 ? 'bg-success/10 border-success/20 text-success' 
 : 'bg-error/10 border-error/20 text-error'
 }`}>
 <p className="font-bold text-label-md">{notification.message}</p>
 <button onClick={() => setNotification(null)} className="opacity-70 hover:opacity-100">
 <X size={18} />
 </button>
 </div>
 )}

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
 <ServiceRequestToolbar filters={filters} onFilterChange={handleFilterChange} hideAssignmentFilter={true} />

 {/* Table - Reader has Edit and Delete but no status mutations */}
 <ServiceRequestTable
 data={data}
 isLoading={isLoading}
 onViewDetails={handleViewDetails}
 onEdit={(req) => {
 setRequestToEdit(req)
 setIsModalOpen(true)
 }}
 onDelete={(req) => {
 setRequestToDelete(req)
 setIsDeleteModalOpen(true)
 }}
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

 {/* Add/Edit Modal */}
 <ServiceRequestModal
 isOpen={isModalOpen}
 onClose={() => {
 setIsModalOpen(false)
 setRequestToEdit(undefined)
 }}
 requestToEdit={requestToEdit}
 onSuccess={() => {
 fetchRequests(filters)
 setNotification({ 
 type: 'success', 
 message: requestToEdit 
 ? (isRTL ? 'تم تعديل الطلب بنجاح' : 'Request updated successfully') 
 : (isRTL ? 'تم إضافة الطلب بنجاح' : 'Request created successfully')
 })
 }}
 />

 {/* Delete Confirmation Modal */}
 <ConfirmDialog
 open={isDeleteModalOpen}
 onClose={() => setIsDeleteModalOpen(false)}
 onConfirm={handleDeleteConfirm}
 title={isRTL ? 'تأكيد الحذف' : 'Confirm Deletion'}
 message={isRTL ? 'هل أنت متأكد من حذف طلب الخدمة؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to delete this service request? This action cannot be undone.'}
 confirmLabel={isRTL ? 'حذف' : 'Delete'}
 cancelLabel={isRTL ? 'إلغاء' : 'Cancel'}
 loading={isDeleting}
 />
 </div>
 )
}
