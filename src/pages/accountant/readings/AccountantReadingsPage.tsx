import React, { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { MeterReading, ReadingStatus } from '../../shared/readings/types'
import { getMeterReadingStats } from '../../shared/readings/data/mockData'
import { MeterReadingStats } from '../../shared/readings/components/MeterReadingStats'
import { MeterReadingToolbar } from '../../shared/readings/components/MeterReadingToolbar'
import { MeterReadingTable } from '../../shared/readings/components/MeterReadingTable'
import { MeterReadingDetailsDrawer } from '../../shared/readings/components/MeterReadingDetailsDrawer'
import { AddMeterReadingModal } from '../../admin/readings/components/AddMeterReadingModal'
import { ChangeReadingStatusModal } from '../../admin/readings/components/ChangeReadingStatusModal'
import { readingService, GetReadingsParams } from '../../../services/shared/readingService'
import { Pagination } from '@/components/ui/Pagination'

export function AccountantReadingsPage() {
 const { t } = useTranslation('readings')
 const { isRTL } = useLanguage()

 const [isLoading, setIsLoading] = useState(true)
 const [error, setError] = useState<string | null>(null)

 const [data, setData] = useState<MeterReading[]>([])
 const [total, setTotal] = useState(0)
 const [currentPage, setCurrentPage] = useState(1)
 const [lastPage, setLastPage] = useState(1)

 const [filters, setFilters] = useState<GetReadingsParams>({
 page: 1,
 per_page: 10,
 search: '',
 status: 'all',
 method: 'all',
 date: 'all',
 })

 const [selectedReading, setSelectedReading] = useState<MeterReading | null>(null)
 const [readingToEdit, setReadingToEdit] = useState<MeterReading | undefined>()
 const [readingToDelete, setReadingToDelete] = useState<MeterReading | null>(null)
 const [readingToChangeStatus, setReadingToChangeStatus] = useState<MeterReading | null>(null)

 const [isDetailsOpen, setIsDetailsOpen] = useState(false)
 const [isAddModalOpen, setIsAddModalOpen] = useState(false)
 const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
 const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)

 const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

 const stats = useMemo(() => getMeterReadingStats(data), [data])

 const fetchReadings = async (currentFilters: GetReadingsParams) => {
 setIsLoading(true)
 setError(null)
 try {
 const response = await readingService.getReadings(currentFilters)
 setData(response.data)
 setTotal(response.total)
 setCurrentPage(response.current_page)
 setLastPage(response.last_page)
 } catch (err) {
 setError('حدث خطأ أثناء جلب البيانات')
 } finally {
 setIsLoading(false)
 }
 }

 useEffect(() => {
 fetchReadings(filters)
 }, [filters])

 const handleSearchChange = (search: string) => setFilters({ ...filters, search, page: 1 })
 const handleStatusChange = (status: string) => setFilters({ ...filters, status, page: 1 })
 const handleMethodChange = (method: string) => setFilters({ ...filters, method, page: 1 })
 const handleDateChange = (date: string) => setFilters({ ...filters, date, page: 1 })
 const handlePageChange = (page: number) => setFilters({ ...filters, page })

 const handleViewDetails = (reading: MeterReading) => {
 setSelectedReading(reading)
 setIsDetailsOpen(true)
 }

 const handleSavedReading = () => {
 fetchReadings(filters)
 setNotification({ type: 'success', message: readingToEdit ? (isRTL ? 'تم تعديل القراءة بنجاح' : 'Reading updated successfully') : t('notifications.added') })
 }

 const handleStatusChangeSubmit = (readingId: number, newStatus: ReadingStatus) => {
 setData(prev => prev.map(r => r.id === readingId ? { ...r, status: newStatus } : r))
 setNotification({ type: 'success', message: isRTL ? 'تم تغيير حالة القراءة بنجاح' : 'Status updated successfully' })
 setIsStatusModalOpen(false)
 }

 const handleDeleteConfirm = () => {
 // Mock delete by removing from local state
 setData(prev => prev.filter(r => r.id !== readingToDelete?.id))
 setIsDeleteModalOpen(false)
 setReadingToDelete(null)
 setNotification({ type: 'success', message: isRTL ? 'تم حذف القراءة بنجاح' : 'Reading deleted successfully' })
 }

 useEffect(() => {
 if (notification) {
 const timer = setTimeout(() => setNotification(null), 3000)
 return () => clearTimeout(timer)
 }
 }, [notification])

 return (
 <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
 {/* Header Section */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div className="text-start">
 <h1 className="font-headline-md text-headline-md font-bold text-primary ">
 إدارة القراءات
 </h1>
 </div>
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

 {error && (
 <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 flex justify-between items-center">
 <span>{error}</span>
 </div>
 )}

 {/* Stats */}
 <MeterReadingStats stats={stats} />

 {/* Toolbar */}
 <MeterReadingToolbar
 searchQuery={filters.search || ''}
 onSearchChange={handleSearchChange}
 statusFilter={filters.status || 'all'}
 onStatusFilterChange={handleStatusChange}
 methodFilter={filters.method || 'all'}
 onMethodFilterChange={handleMethodChange}
 dateFilter={filters.date || 'all'}
 onDateFilterChange={handleDateChange}
 onRefresh={() => fetchReadings(filters)}
 />

 {/* Table */}
 <MeterReadingTable
 data={data}
 onViewDetails={handleViewDetails}
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

 {/* Details Drawer */}
 <MeterReadingDetailsDrawer
 reading={selectedReading}
 isOpen={isDetailsOpen}
 onClose={() => setIsDetailsOpen(false)}
 />

 {/* Add/Edit Reading Modal */}
 <AddMeterReadingModal
 isOpen={isAddModalOpen}
 onClose={() => {
 setIsAddModalOpen(false)
 setReadingToEdit(undefined)
 }}
 onSaved={handleSavedReading}
 reading={readingToEdit}
 />

 <ChangeReadingStatusModal
 isOpen={isStatusModalOpen}
 onClose={() => setIsStatusModalOpen(false)}
 reading={readingToChangeStatus}
 onSave={handleStatusChangeSubmit}
 />

 {/* Delete Confirmation Modal */}
 {isDeleteModalOpen && createPortal(
 <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
 <div
 onClick={() => setIsDeleteModalOpen(false)}
 style={{
 position: 'absolute',
 inset: 0,
 backgroundColor: 'rgba(0,0,0,0.4)',
 zIndex: 0,
 }}
 />
 <aside
 className="absolute inset-0 flex items-center justify-center p-4 sm:p-6"
 style={{ zIndex: 1 }}
 dir={isRTL ? 'rtl' : 'ltr'}
 >
 <div
 className="w-full max-w-sm rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden"
 style={{
 backgroundColor: '#ffffff',
 opacity: 1,
 filter: 'none'
 }}
 >
 <div className="p-6">
 <h2 className="font-headline-sm text-lg font-bold text-text-primary mb-2">
 {isRTL ? 'تأكيد الحذف' : 'Confirm Deletion'}
 </h2>
 <p className="text-sm text-text-muted ">
 {isRTL
 ? 'هل أنت متأكد أنك تريد حذف هذه القراءة؟ لا يمكن التراجع عن هذا الإجراء.'
 : 'Are you sure you want to delete this reading? This action cannot be undone.'}
 </p>
 </div>
 <div className="p-4 border-t border-border bg-surface-low flex justify-end gap-3">
 <button
 onClick={() => setIsDeleteModalOpen(false)}
 className="px-4 py-2 rounded-lg text-sm font-semibold text-text-muted hover:bg-surface-container :bg-surface-container transition-colors"
 >
 {isRTL ? 'إلغاء' : 'Cancel'}
 </button>
 <button
 onClick={handleDeleteConfirm}
 className="px-4 py-2 rounded-lg text-sm font-semibold bg-error text-white hover:bg-error/90 transition-colors"
 >
 {isRTL ? 'حذف' : 'Delete'}
 </button>
 </div>
 </div>
 </aside>
 </div>,
 document.body
 )}
 </div>
 )
}
