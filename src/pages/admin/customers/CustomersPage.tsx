import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Search, Filter, Trash2, Edit, Eye, UserPlus, Users, Home, Building, Factory } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
import { Pagination } from '@/components/ui/Pagination'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'
import {
  fetchCustomersPaginated,
  fetchCustomerStats,
  deleteCustomer,
  CustomerApiRecord,
  CustomerStatsData,
  GetCustomersParams,
} from '@/services/customers.service'
import { AddCustomerModal } from './components/AddCustomerModal'
import { CustomerDetailsDrawer } from './components/CustomerDetailsDrawer'
import { showSuccess, showError } from '@/utils/toast'

export default function CustomersPage() {
  const { t } = useTranslation('customers')
  const { isRTL } = useLanguage()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [customers, setCustomers] = useState<CustomerApiRecord[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)

  const [stats, setStats] = useState<CustomerStatsData>({
    total_customers: 0,
    residential_count: 0,
    commercial_count: 0,
    industrial_count: 0,
  })

  const [filters, setFilters] = useState<GetCustomersParams>({
    page: 1,
    per_page: 10,
    search: '',
    customer_type: 'all',
  })

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerApiRecord | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<CustomerApiRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadData = async (currentFilters: GetCustomersParams) => {
    setIsLoading(true)
    setError(null)
    try {
      const [paginatedRes, statsRes] = await Promise.all([
        fetchCustomersPaginated(currentFilters),
        fetchCustomerStats(),
      ])

      setCustomers(paginatedRes.data || [])
      setTotal(paginatedRes.total || 0)
      setCurrentPage(paginatedRes.current_page || 1)
      setLastPage(paginatedRes.last_page || 1)
      setStats(statsRes)
    } catch {
      setError('تعذر تحميل بيانات العملاء. يرجى المحاولة مرة أخرى.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData(filters)
  }, [filters])

  const handleSearchChange = (val: string) => {
    setFilters((prev) => ({ ...prev, search: val, page: 1 }))
  }

  const handleTypeFilterChange = (val: string) => {
    setFilters((prev) => ({ ...prev, customer_type: val, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const handleViewDetails = (customer: CustomerApiRecord) => {
    setSelectedCustomer(customer)
    setIsDetailsOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return
    setIsDeleting(true)
    try {
      await deleteCustomer(customerToDelete.id)
      showSuccess('تم حذف العميل بنجاح.', 'تم الحذف')
      setCustomerToDelete(null)
      loadData(filters)
    } catch (err: any) {
      showError(
        err?.response?.data?.message || 'تعذر حذف العميل، قد يكون مرتبطاً بعدادات أو فواتير قائمة.',
        'فشل الحذف',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const getCustomerTypeBadge = (type?: string | null) => {
    switch (type) {
      case 'residential':
        return <Badge variant="info">سكني</Badge>
      case 'commercial':
        return <Badge variant="warning">تجاري</Badge>
      case 'industrial':
        return <Badge variant="primary">صناعي</Badge>
      default:
        return <Badge variant="neutral">عام</Badge>
    }
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto w-full pb-12 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">إدارة العملاء</h1>
          <p className="text-text-muted text-sm mt-1">إدارة واستعراض جميع المشتركين والعملاء المسجلين بالمحطة</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className={cn("flex items-center gap-2", isRTL ? "flex-row-reverse" : "flex-row")}
        >
          <Plus size={18} />
          <span>إضافة عميل جديد</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="إجمالي العملاء"
          value={stats.total_customers.toString()}
          icon={<Users size={22} />}
          iconClassName="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="العملاء السكنيون"
          value={stats.residential_count.toString()}
          icon={<Home size={22} />}
          iconClassName="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="العملاء التجاريون"
          value={stats.commercial_count.toString()}
          icon={<Building size={22} />}
          iconClassName="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="العملاء الصناعيون"
          value={stats.industrial_count.toString()}
          icon={<Factory size={22} />}
          iconClassName="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-surface rounded-xl border border-border p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="ابحث باسم العميل أو رقم العميل أو الهاتف..."
            className="w-full pr-10 pl-4 py-2 bg-surface-low border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
            <Filter size={16} />
            <span>نوع العميل:</span>
          </div>
          <select
            value={filters.customer_type || 'all'}
            onChange={(e) => handleTypeFilterChange(e.target.value)}
            className="bg-surface-low border border-border rounded-lg text-sm text-text px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">جميع الأنواع</option>
            <option value="residential">سكني</option>
            <option value="commercial">تجاري</option>
            <option value="industrial">صناعي</option>
          </select>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 flex justify-between items-center text-sm">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={() => loadData(filters)}>إعادة المحاولة</Button>
        </div>
      )}

      {/* Customers Table */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-text-muted animate-pulse">جاري تحميل قائمة العملاء...</div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-text-muted flex flex-col items-center gap-3">
            <UserPlus size={36} className="text-text-muted/50" />
            <p className="font-semibold text-sm">لا يوجد عملاء مسجلون حالياً بهذه الفلاتر.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right" dir="rtl">
              <thead>
                <tr className="bg-surface-container-low text-text-muted font-semibold border-b border-border">
                  <th className="p-4">رقم العميل</th>
                  <th className="p-4">اسم العميل</th>
                  <th className="p-4">نوع العميل</th>
                  <th className="p-4">رقم الهاتف</th>
                  <th className="p-4">العنوان</th>
                  <th className="p-4">العدادات</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="p-4 font-bold text-primary" dir="ltr">{c.customer_number || `CUST-${c.id}`}</td>
                    <td className="p-4 font-semibold text-text">{c.full_name}</td>
                    <td className="p-4">{getCustomerTypeBadge(c.customer_type)}</td>
                    <td className="p-4 text-text" dir="ltr">{c.phone || 'غير مسجل'}</td>
                    <td className="p-4 text-text-muted max-w-[200px] truncate">{c.address_description || 'غير محدد'}</td>
                    <td className="p-4 font-bold text-text-muted">{c.meters_count ?? 0} عداد</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewDetails(c)}
                          className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                          title="عرض التفاصيل"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => setCustomerToDelete(c)}
                          className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                          title="حذف العميل"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && customers.length > 0 && (
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

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={() => loadData(filters)}
      />

      {/* Customer Details Drawer */}
      <CustomerDetailsDrawer
        customer={selectedCustomer}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      {customerToDelete && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }} className="flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40" onClick={() => setCustomerToDelete(null)} />
          <div className="relative bg-surface p-6 rounded-2xl max-w-md w-full border border-border shadow-2xl z-10 text-right" dir="rtl">
            <h3 className="text-lg font-bold text-red-600 mb-2">تأكيد حذف العميل</h3>
            <p className="text-sm text-text-muted mb-6">
              هل أنت تأكد من رغبتك في حذف العميل <span className="font-bold text-text">{customerToDelete.full_name}</span>؟
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setCustomerToDelete(null)} disabled={isDeleting}>إلغاء</Button>
              <Button onClick={handleDeleteConfirm} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white">
                {isDeleting ? 'جاري الحذف...' : 'حذف العميل'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
