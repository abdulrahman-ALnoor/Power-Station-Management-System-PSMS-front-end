import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/hooks/useLanguage'
import { OverdueInvoicesPage } from '@/pages/admin/reports/OverdueInvoicesPage'







import { EditInvoiceModal } from './components/EditInvoiceModal'
import { InvoiceStats } from './components/InvoiceStats'
import { InvoiceCharts } from './components/InvoiceCharts'
import { InvoiceToolbar } from './components/InvoiceToolbar'
import { InvoiceTable } from './components/InvoiceTable'
import { InvoiceDetailsDrawer } from './components/InvoiceDetailsDrawer'
import { InvoiceShortcutCards } from './components/InvoiceShortcutCards'
import { AddInvoiceModal } from './components/AddInvoiceModal'

import {
  fetchInvoices,
  fetchInvoiceStats,
  deleteInvoice,
  downloadInvoicePdf,
  type InvoiceApiRecord,
  type InvoiceStatsResponse,
} from '@/services/invoices.service'

import type { Invoice } from './types'

export function InvoicesManagementPage() {
  const { t } = useTranslation('invoices')
  const { isRTL } = useLanguage()

  // =========================
  // States
  // =========================

  const [items, setItems] = useState<InvoiceApiRecord[]>([])
  const [stats, setStats] =
    useState<InvoiceStatsResponse | null>(null)

  // الفاتورة المحددة لعرض التفاصيل
  const [selectedInvoiceId, setSelectedInvoiceId] =
    useState<number | null>(null)

  // الفاتورة المحددة للتعديل
  const [
    selectedInvoiceForEdit,
    setSelectedInvoiceForEdit,
  ] = useState<InvoiceApiRecord | null>(null)

  // نافذة إضافة فاتورة
  const [isAddModalOpen, setIsAddModalOpen] =
    useState(false)

  // نافذة تعديل الفاتورة
  const [isEditModalOpen, setIsEditModalOpen] =
    useState(false)

  // حالات التحميل
  const [isLoading, setIsLoading] = useState(true)

  const [isRefreshing, setIsRefreshing] =
    useState(false)

  const [isExporting, setIsExporting] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  // =========================
  // البحث والفلترة
  // =========================

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  // =========================
  // Pagination
  // =========================

  const [currentPage, setCurrentPage] =
    useState(1)

  const [lastPage, setLastPage] =
    useState(1)

  const [total, setTotal] =
    useState(0)

  // =========================
  // تحميل الفواتير والإحصائيات
  // =========================

  const loadData = async (
    page = currentPage,
    searchValue = search,
    statusValue = status,
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      const [
        invoiceResponse,
        statsResponse,
      ] = await Promise.all([
        fetchInvoices({
          page,
          per_page: 20,
          search:
            searchValue.trim() || undefined,
          status:
            statusValue || undefined,
        }),

        fetchInvoiceStats(),
      ])

      setItems(invoiceResponse.data)

      setCurrentPage(
        invoiceResponse.current_page,
      )

      setLastPage(
        invoiceResponse.last_page,
      )

      setTotal(invoiceResponse.total)

      setStats(statsResponse)
    } catch (requestError) {
      const apiError = requestError as {
        message?: string
        status?: number
      }

      setError(
        apiError.message ||
          `تعذر تحميل الفواتير${
            apiError.status
              ? ` (HTTP ${apiError.status})`
              : ''
          }`,
      )
    } finally {
      setIsLoading(false)
    }
  }

  // =========================
  // التحميل الأول
  // =========================

  useEffect(() => {
    void loadData(1, '', '')
  }, [])

  const safeItems =
    Array.isArray(items)
      ? items
      : []

  // =========================
  // البحث
  // =========================

  const handleSearch = (
    value: string,
  ) => {
    setSearch(value)
    setCurrentPage(1)

    void loadData(
      1,
      value,
      status,
    )
  }

  // =========================
  // فلترة الحالة
  // =========================

  const handleStatusChange = (
    value: string,
  ) => {
    setStatus(value)
    setCurrentPage(1)

    void loadData(
      1,
      search,
      value,
    )
  }

  // =========================
  // تحديث البيانات
  // =========================

  const handleRefresh = async () => {
    setIsRefreshing(true)

    try {
      await loadData()
    } finally {
      setIsRefreshing(false)
    }
  }

  // =========================
  // تصدير PDF
  // =========================

  const handleExport = async (
    invoice: InvoiceApiRecord,
  ) => {
    setIsExporting(true)

    try {
      const blob =
        await downloadInvoicePdf(
          invoice.id,
        )

      const url =
        window.URL.createObjectURL(
          blob,
        )

      const link =
        document.createElement('a')

      link.href = url

      link.download =
        `invoice-${invoice.invoice_number}.pdf`

      document.body.appendChild(link)

      link.click()

      document.body.removeChild(link)

      window.URL.revokeObjectURL(url)
    } catch (requestError) {
      const apiError = requestError as {
        message?: string
      }

      window.alert(
        apiError.message ||
          'تعذر تنزيل ملف PDF للفاتورة.',
      )
    } finally {
      setIsExporting(false)
    }
  }

  // =========================
  // حذف فاتورة
  // =========================

  const handleDelete = async (
    invoice: InvoiceApiRecord,
  ) => {
    const confirmed =
      window.confirm(
        `هل تريد حذف الفاتورة ${invoice.invoice_number}؟`,
      )

    if (!confirmed) return

    try {
      await deleteInvoice(invoice.id)

      window.alert(
        'تم حذف الفاتورة بنجاح',
      )

      await loadData()
    } catch (requestError) {
      const apiError = requestError as {
        message?: string
      }

      window.alert(
        apiError.message ||
          'تعذر حذف الفاتورة',
      )
    }
  }

  // =========================
  // تعديل فاتورة
  // =========================

  const handleEdit = (
    invoice: InvoiceApiRecord,
  ) => {
    setSelectedInvoiceForEdit(invoice)

    setIsEditModalOpen(true)
  }

  // =========================
  // الفاتورة المحددة للتفاصيل
  // =========================

  const selectedApiInvoice =
    safeItems.find(
      (invoice) =>
        invoice.id ===
        selectedInvoiceId,
    ) ?? null

  const selectedInvoice:
    | Invoice
    | null =
    selectedApiInvoice
      ? {
          id:
            selectedApiInvoice.id,

          invoice_number:
            selectedApiInvoice.invoice_number,

          customer_id:
            selectedApiInvoice.customer
              ?.id ?? 0,

          accountant_id: 0,

          consumption_charge_id:
            selectedApiInvoice
              .consumption_charge
              ?.id ?? 0,

          outstanding_before_payment:
            selectedApiInvoice
              .consumption_charge
              ?.total_amount ?? 0,

          paid_amount:
            selectedApiInvoice.paid_amount,

          remaining_balance:
            selectedApiInvoice.remaining_balance,

          status:
            String(
              selectedApiInvoice.status,
            ) as Invoice['status'],

          payment_notes:
            selectedApiInvoice.payment_notes,

          created_at:
            selectedApiInvoice.created_at,

          updated_at:
            selectedApiInvoice.created_at,

          customer:
            selectedApiInvoice.customer
              ?.name
              ? {
                  id:
                    selectedApiInvoice.customer
                      ?.id ?? 0,

                  name:
                    selectedApiInvoice.customer
                      ?.name ?? '',
                }
              : undefined,
        }
      : null

  // =========================
  // عند إنشاء فاتورة جديدة
  // =========================

  const handleInvoiceCreated = async () => {
    setIsAddModalOpen(false)

    await loadData()
  }

  // =========================
  // UI
  // =========================

  return (
    <>
      <div className="space-y-6">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div className="text-start">

            <h1 className="text-display-sm font-display-sm font-bold text-on-surface dark:text-on-dark">
              {t('pageTitle')}
            </h1>

            <p className="text-body-md text-outline mt-1">
              {t('pageSubtitle')}
            </p>

            <nav
              className="flex gap-2 text-label-sm text-outline mt-2"
              dir={
                isRTL
                  ? 'rtl'
                  : 'ltr'
              }
              aria-label={t('breadcrumb.invoices')}
            >
              <span>
                {t('breadcrumb.home')}
              </span>

              <span>/</span>

              <span>
                {t('breadcrumb.invoices')}
              </span>
            </nav>

          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="p-4 rounded-xl bg-error/10 text-error text-sm">
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="p-4 rounded-xl bg-surface-container-low text-outline text-sm">
            جاري تحميل بيانات الفواتير...
          </div>
        )}

        {/* Statistics */}
        <InvoiceStats
          stats={stats}
        />

        {/* Charts */}
        <InvoiceCharts />

        {/* Toolbar */}
       {/* Toolbar */}
<InvoiceToolbar
  onCreateInvoice={() =>
    setIsAddModalOpen(true)
  }
  onRefresh={() =>
    void handleRefresh()
  }
  onSearch={handleSearch}
  onStatusChange={handleStatusChange}
  isRefreshing={isRefreshing}
/>

        {/* Invoice Table */}
        <InvoiceTable
          items={safeItems}
          total={total}
          onRowClick={(id) =>
            setSelectedInvoiceId(id)
          }
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDownloadPdf={(invoice) =>
            void handleExport(invoice)
          }
        />

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="flex items-center justify-center gap-4">

            <button
              type="button"
              disabled={
                currentPage <= 1
              }
              onClick={() =>
                void loadData(
                  currentPage - 1,
                )
              }
              className="px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed"
            >
              السابق
            </button>

            <span className="text-sm text-outline">
              الصفحة {currentPage} من{' '}
              {lastPage}
            </span>

            <button
              type="button"
              disabled={
                currentPage >= lastPage
              }
              onClick={() =>
                void loadData(
                  currentPage + 1,
                )
              }
              className="px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed"
            >
              التالي
            </button>

          </div>
        )}

        {/* Export Loading */}
        {isExporting && (
          <div className="p-3 rounded-xl bg-primary/10 text-primary text-sm">
            جاري تجهيز وتحميل ملف PDF...
          </div>
        )}

        {/* Shortcut Cards */}
        <InvoiceShortcutCards />

      </div>

      {/* Invoice Details Drawer */}
      <InvoiceDetailsDrawer
        invoice={selectedInvoice}
        isOpen={
          selectedInvoiceId !== null
        }
        onClose={() =>
          setSelectedInvoiceId(null)
        }
      />

      {/* Add Invoice Modal */}
      <AddInvoiceModal
        isOpen={isAddModalOpen}
        onClose={() =>
          setIsAddModalOpen(false)
        }
        onAdd={handleInvoiceCreated}
      />

      {/* Edit Invoice Modal */}
      <EditInvoiceModal
        isOpen={isEditModalOpen}
        invoice={selectedInvoiceForEdit}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedInvoiceForEdit(null)
        }}
        onUpdated={() => {
          setIsEditModalOpen(false)
          setSelectedInvoiceForEdit(null)

          void loadData()
        }}
      />
    </>
  )
}