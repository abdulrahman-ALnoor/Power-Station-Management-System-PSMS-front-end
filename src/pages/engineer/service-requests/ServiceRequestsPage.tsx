import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, X } from 'lucide-react'
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
import { ConfirmDialog } from '@/components/overlays/ConfirmDialog'

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

  // Actions modals state
  const [startExecRequest, setStartExecRequest] = useState<ServiceRequest | null>(null)
  const [isStartingExec, setIsStartingExec] = useState(false)

  const [completeReq, setCompleteReq] = useState<ServiceRequest | null>(null)
  const [executionNotes, setExecutionNotes] = useState('')
  const [completionNotes, setCompletionNotes] = useState('')
  const [isCompleting, setIsCompleting] = useState(false)
  const [completeError, setCompleteError] = useState<string | null>(null)

  const [cancelReq, setCancelReq] = useState<ServiceRequest | null>(null)
  const [cancellationReason, setCancellationReason] = useState('')
  const [isCancelling, setIsCancelling] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)

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
    } catch {
      setError(t('serviceRequests.errorState', 'تعذر تحميل طلبات الخدمة. تأكد من اتصال الخادم.'))
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

  // Handle Start Execution
  const handleConfirmStartExecution = async () => {
    if (!startExecRequest) return
    setIsStartingExec(true)
    try {
      await serviceRequestService.updateServiceRequestStatus(startExecRequest.id, 'in_progress')
      setNotification({ type: 'success', message: 'تم بدء تنفيذ الطلب بنجاح.' })
      setStartExecRequest(null)
      fetchRequests(filters)
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.response?.data?.message || 'تعذر بدء تنفيذ الطلب.' })
    } finally {
      setIsStartingExec(false)
    }
  }

  // Handle Complete Request
  const handleConfirmComplete = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!completeReq) return
    setIsCompleting(true)
    setCompleteError(null)
    try {
      await serviceRequestService.updateServiceRequestStatus(completeReq.id, 'completed', {
        execution_notes: executionNotes,
        completion_notes: completionNotes,
      })
      setNotification({ type: 'success', message: 'تم إكمال طلب الخدمة بنجاح.' })
      setCompleteReq(null)
      setExecutionNotes('')
      setCompletionNotes('')
      fetchRequests(filters)
    } catch (err: any) {
      setCompleteError(err?.response?.data?.message || 'تعذر إكمال طلب الخدمة.')
    } finally {
      setIsCompleting(false)
    }
  }

  // Handle Cancel Request
  const handleConfirmCancel = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cancelReq) return
    if (!cancellationReason.trim()) {
      setCancelError('سبب الإلغاء مطلوب عند إلغاء طلب الخدمة.')
      return
    }
    setIsCancelling(true)
    setCancelError(null)
    try {
      await serviceRequestService.updateServiceRequestStatus(cancelReq.id, 'cancelled', {
        cancellation_reason: cancellationReason,
      })
      setNotification({ type: 'success', message: 'تم إلغاء طلب الخدمة بنجاح.' })
      setCancelReq(null)
      setCancellationReason('')
      fetchRequests(filters)
    } catch (err: any) {
      setCancelError(err?.response?.data?.message || 'تعذر إلغاء طلب الخدمة.')
    } finally {
      setIsCancelling(false)
    }
  }

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto w-full pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-sm text-headline-sm font-bold text-primary">
            {t('serviceRequests.title', 'إدارة طلبات الخدمة')}
          </h1>
          <p className="text-text-muted text-sm mt-1">
            {t('serviceRequests.breadcrumb', 'الرئيسية / طلبات الخدمة')}
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className={cn("flex items-center gap-2", isRTL ? "flex-row-reverse" : "flex-row")}
        >
          <Plus size={18} />
          <span>{t('serviceRequests.createRequest', 'إضافة طلب خدمة')}</span>
        </Button>
      </div>

      {/* Toast Notification */}
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
          <Button variant="outline" size="sm" onClick={() => fetchRequests(filters)}>إعادة المحاولة</Button>
        </div>
      )}

      {/* Toolbar */}
      <ServiceRequestToolbar filters={filters} onFilterChange={handleFilterChange} />

      {/* Table */}
      <ServiceRequestTable
        data={data}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
        onStartExecution={(req) => setStartExecRequest(req)}
        onCompleteRequest={(req) => {
          setCompleteReq(req)
          setExecutionNotes('')
          setCompletionNotes('')
          setCompleteError(null)
        }}
        onCancelRequest={(req) => {
          setCancelReq(req)
          setCancellationReason('')
          setCancelError(null)
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

      {/* Create Modal */}
      <ServiceRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          fetchRequests(filters)
          setNotification({ type: 'success', message: 'تم إضافة طلب الخدمة بنجاح.' })
        }}
      />

      {/* 1. Start Execution Confirm Dialog */}
      <ConfirmDialog
        open={Boolean(startExecRequest)}
        onClose={() => setStartExecRequest(null)}
        onConfirm={handleConfirmStartExecution}
        title="بدء تنفيذ الطلب"
        message="هل أنت متأكد من بدء تنفيذ طلب الخدمة؟"
        confirmLabel="بدء التنفيذ"
        cancelLabel="إلغاء"
        loading={isStartingExec}
      />

      {/* 2. Complete Request Modal */}
      {completeReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="bg-surface rounded-2xl border border-border shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="font-bold text-lg text-primary">إكمال طلب الخدمة ({completeReq.request_number || `SR-${completeReq.id}`})</h3>
              <button onClick={() => setCompleteReq(null)} className="text-text-muted hover:text-text">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleConfirmComplete} className="p-6 space-y-4">
              {completeError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
                  {completeError}
                </div>
              )}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-text">ملاحظات التنفيذ</label>
                <textarea
                  rows={3}
                  value={executionNotes}
                  onChange={(e) => setExecutionNotes(e.target.value)}
                  placeholder="أدخل أي ملاحظات فنية أثناء إجراء الصيانة والتنفيذ..."
                  className="w-full p-3 bg-surface border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-text">وصف ما تم إنجازه</label>
                <textarea
                  rows={3}
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  placeholder="اصف الإجراءات المكتملة وحالة العمل بعد الانتهاء..."
                  className="w-full p-3 bg-surface border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setCompleteReq(null)} disabled={isCompleting}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={isCompleting} className="min-w-[120px]">
                  {isCompleting ? 'جاري التنفيذ...' : 'تأكيد إكمال الطلب'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Cancel Request Modal */}
      {cancelReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="bg-surface rounded-2xl border border-border shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="font-bold text-lg text-primary">إلغاء طلب الخدمة ({cancelReq.request_number || `SR-${cancelReq.id}`})</h3>
              <button onClick={() => setCancelReq(null)} className="text-text-muted hover:text-text">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleConfirmCancel} className="p-6 space-y-4">
              {cancelError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
                  {cancelError}
                </div>
              )}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-text">سبب الإلغاء *</label>
                <textarea
                  rows={4}
                  required
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="يرجى كتابة سبب توقف أو إلغاء هذا الطلب بشكل واضح..."
                  className="w-full p-3 bg-surface border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setCancelReq(null)} disabled={isCancelling}>
                  رجوع
                </Button>
                <Button type="submit" variant="danger" disabled={isCancelling} className="min-w-[120px]">
                  {isCancelling ? 'جاري الإلغاء...' : 'تأكيد الإلغاء'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
