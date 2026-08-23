import React, { useState, useEffect } from 'react'
import {
  Printer,
  RefreshCw,
  Search,
  Filter,
  Users,
  Gauge,
  Activity,
  Zap,
  Receipt,
  DollarSign,
  TrendingUp,
  Headset,
  Wrench,
  UserCheck,
  PieChart,
  FileSpreadsheet,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from 'recharts'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'
import { formatDate, formatCurrency } from '@/utils/formatDate'
import reportsService from '@/services/reportsService'
import { BrandLogo } from '@/components/common/BrandLogo'
import type {
  CustomerReportItem,
  MeterReportItem,
  ReadingReportItem,
  InvoiceReportItem,
  ServiceRequestReportItem,
  EquipmentReportItem,
  EmployeeReportItem,
} from '@/types/reports'

type ReportType =
  | 'customers'
  | 'meters'
  | 'readings'
  | 'consumption'
  | 'invoices'
  | 'collections'
  | 'revenue'
  | 'service-requests'
  | 'equipment'
  | 'employees'
  | 'comprehensive'

interface ReportTabOption {
  id: ReportType
  label: string
  icon: React.ReactNode
}

const REPORT_TABS: ReportTabOption[] = [
  { id: 'customers', label: 'تقرير العملاء', icon: <Users size={16} /> },
  { id: 'meters', label: 'تقرير العدادات', icon: <Gauge size={16} /> },
  { id: 'readings', label: 'تقرير القراءات', icon: <Activity size={16} /> },
  { id: 'consumption', label: 'تقرير الاستهلاك', icon: <Zap size={16} /> },
  { id: 'invoices', label: 'تقرير الفواتير', icon: <Receipt size={16} /> },
  { id: 'collections', label: 'تقرير التحصيلات', icon: <DollarSign size={16} /> },
  { id: 'revenue', label: 'تقرير الإيرادات', icon: <TrendingUp size={16} /> },
  { id: 'service-requests', label: 'تقرير طلبات الخدمة', icon: <Headset size={16} /> },
  { id: 'equipment', label: 'تقرير المعدات', icon: <Wrench size={16} /> },
  { id: 'employees', label: 'تقرير الموظفين', icon: <UserCheck size={16} /> },
  { id: 'comprehensive', label: 'التقرير الشامل', icon: <PieChart size={16} /> },
]

/**
 * Standardizes API pagination and data array extraction
 */
export function normalizeReportResponse(response: any) {
  let rows: any[] = []
  let currentPage = 1
  let lastPage = 1
  let total = 0
  let from = 0
  let to = 0

  if (!response) {
    return { rows, currentPage, lastPage, total, from, to }
  }

  const payload = response.data || response

  if (Array.isArray(payload)) {
    rows = payload
    total = payload.length
    lastPage = 1
    from = rows.length > 0 ? 1 : 0
    to = rows.length
  } else if (payload && Array.isArray(payload.data)) {
    rows = payload.data
    currentPage = payload.current_page || 1
    lastPage = payload.last_page || 1
    total = payload.total || rows.length
    from = payload.from || (rows.length > 0 ? 1 : 0)
    to = payload.to || rows.length
  } else if (response && Array.isArray(response.data)) {
    rows = response.data
    total = rows.length
    from = rows.length > 0 ? 1 : 0
    to = rows.length
  }

  return {
    rows,
    currentPage,
    lastPage,
    total,
    from,
    to,
  }
}

export default function AdminReportsPage() {
  const { isRTL } = useLanguage()

  const [activeTab, setActiveTab] = useState<ReportType>('customers')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [isLoading, setIsLoading] = useState(true)
  const [reportResponse, setReportResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchReport = async () => {
    setIsLoading(true)
    setError(null)

    const params: Record<string, any> = { page, per_page: 20 }
    if (fromDate) params.from_date = fromDate
    if (toDate) params.to_date = toDate
    if (search) params.search = search
    if (statusFilter !== 'all') params.status = statusFilter
    if (typeFilter !== 'all') {
      if (activeTab === 'customers') params.customer_type = typeFilter
      if (activeTab === 'service-requests') params.request_type = typeFilter
      if (activeTab === 'employees') params.role = typeFilter
    }

    try {
      let res: any
      switch (activeTab) {
        case 'customers':
          res = await reportsService.getCustomerReport(params)
          break
        case 'meters':
          res = await reportsService.getMeterReport(params)
          break
        case 'readings':
          res = await reportsService.getReadingReport(params)
          break
        case 'consumption':
          res = await reportsService.getConsumptionReport(params)
          break
        case 'invoices':
          res = await reportsService.getInvoiceReport(params)
          break
        case 'collections':
          res = await reportsService.getCollectionReport(params)
          break
        case 'revenue':
          res = await reportsService.getRevenueReport(params)
          break
        case 'service-requests':
          res = await reportsService.getServiceRequestReport(params)
          break
        case 'equipment':
          res = await reportsService.getEquipmentReport(params)
          break
        case 'employees':
          res = await reportsService.getEmployeeReport(params)
          break
        case 'comprehensive':
          res = await reportsService.getComprehensiveReport(params)
          break
        default:
          res = await reportsService.getCustomerReport(params)
      }
      setReportResponse(res)
    } catch (err: any) {
      console.error('Report API Error:', err)
      setError('تعذر تحميل التقرير. يرجى التحقق من اتصال الخادم.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
    fetchReport()
  }, [activeTab, page])

  const handleApplyFilters = () => {
    setPage(1)
    fetchReport()
  }

  const handleResetFilters = () => {
    setFromDate('')
    setToDate('')
    setStatusFilter('all')
    setTypeFilter('all')
    setSearch('')
    setPage(1)
    setTimeout(() => fetchReport(), 50)
  }

  const handlePrint = () => {
    window.print()
  }

  const normalized = normalizeReportResponse(reportResponse)
  const items = normalized.rows
  const stats = reportResponse?.stats || {}

  const handleExportCsv = () => {
    if (!items || items.length === 0) {
      alert('لا توجد بيانات لتصديرها.')
      return
    }

    let csvContent = '\uFEFF' // UTF-8 BOM for Arabic support in Excel

    if (activeTab === 'customers') {
      csvContent += 'رقم العميل,اسم العميل,نوع العميل,رقم الهاتف,عدد العدادات,تاريخ التسجيل\n'
      items.forEach((c: CustomerReportItem) => {
        csvContent += `"${c.customer_number}","${c.full_name}","${c.customer_type}","${c.phone || ''}","${c.meters_count}","${formatDate(c.created_at)}"\n`
      })
    } else if (activeTab === 'meters') {
      csvContent += 'رقم العداد,العميل,QR Code,موقع التركيب,الحالة,تاريخ التركيب\n'
      items.forEach((m: MeterReportItem) => {
        csvContent += `"${m.meter_number}","${m.customer?.full_name || ''}","${m.qr_code || ''}","${m.installation_location || ''}","${m.status}","${formatDate(m.installation_date || m.created_at)}"\n`
      })
    } else if (activeTab === 'readings') {
      csvContent += 'رقم العداد,العميل,القراءة السابقة,القراءة الحالية,الاستهلاك,التكلفة,الحالة,تاريخ القراءة\n'
      items.forEach((r: ReadingReportItem) => {
        csvContent += `"${r.meter?.meter_number || ''}","${r.meter?.customer?.full_name || ''}","${r.previous_reading}","${r.current_reading}","${r.consumption} kWh","${r.reading_cost}","${r.status}","${formatDate(r.reading_date)}"\n`
      })
    } else if (activeTab === 'invoices' || activeTab === 'collections') {
      csvContent += 'رقم الفاتورة,العميل,المبلغ قبل السداد,المبلغ المدفوع,المتبقي,المحاسب,الحالة,التاريخ\n'
      items.forEach((inv: any) => {
        const total = inv.outstanding_before_payment ?? inv.total_amount ?? 0
        const remaining = inv.remaining_balance ?? inv.remaining_amount ?? 0
        csvContent += `"${inv.invoice_number}","${inv.customer?.full_name || ''}","${total}","${inv.paid_amount}","${remaining}","${inv.accountant?.name || ''}","${inv.status}","${formatDate(inv.updated_at || inv.created_at)}"\n`
      })
    } else {
      csvContent += 'رقم التعريف,الوصف,التاريخ\n'
      items.forEach((item: any) => {
        csvContent += `"${item.id}","${item.name || item.equipment_name || item.full_name || ''}","${formatDate(item.created_at)}"\n`
      })
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `report-${activeTab}-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto w-full pb-12">
      {/* CSS for Clean Print view */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #report-printable-area, #report-printable-area * { visibility: visible; }
          #report-printable-area { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-primary">نظام التقارير والتحليلات الشاملة</h1>
          <p className="text-sm text-text-muted mt-1">
            عرض وتصدير تقارير محطات الكهرباء للعملاء والعدادات والقراءات والفواتير والإيرادات والمعدات والموظفين.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchReport}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl text-sm font-medium hover:bg-surface-container-high transition-colors text-text"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            <span>تحديث</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-sm hover:opacity-90 transition-opacity"
          >
            <Printer size={16} />
            <span>طباعة التقرير</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-emerald-700 transition-colors"
          >
            <FileSpreadsheet size={16} />
            <span>تصدير Excel/CSV</span>
          </button>
        </div>
      </div>

      {/* Report Category Tabs */}
      <div className="bg-surface rounded-2xl border border-border p-2 overflow-x-auto no-print">
        <div className="flex items-center gap-1 min-w-max">
          {REPORT_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all',
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-muted hover:text-text hover:bg-surface-container-low'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Unified Filters Bar */}
      {activeTab !== 'comprehensive' && (
        <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm space-y-4 no-print">
          <div className="flex items-center gap-2 text-primary font-bold text-sm border-b border-border pb-3">
            <Filter size={18} />
            <span>فلترة ونطاق البيانات</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-text mb-1">من تاريخ</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full p-2.5 bg-surface border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text mb-1">إلى تاريخ</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full p-2.5 bg-surface border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text mb-1">الحالة / التصنيف</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2.5 bg-surface border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">جميع الحالات</option>
                {activeTab === 'meters' && (
                  <>
                    <option value="active">نشط</option>
                    <option value="disconnected">مفصول</option>
                    <option value="maintenance">تحت الصيانة</option>
                    <option value="damaged">تالف</option>
                  </>
                )}
                {activeTab === 'readings' && (
                  <>
                    <option value="approved">معتمد</option>
                    <option value="pending">قيد المراجعة</option>
                    <option value="rejected">مرفوض</option>
                  </>
                )}
                {(activeTab === 'invoices' || activeTab === 'collections') && (
                  <>
                    <option value="paid">مدفوعة</option>
                    <option value="partially_paid">مدفوعة جزئياً</option>
                    <option value="unpaid">غير مدفوعة</option>
                  </>
                )}
                {activeTab === 'service-requests' && (
                  <>
                    <option value="pending">قيد الانتظار</option>
                    <option value="assigned">مسند</option>
                    <option value="in_progress">قيد التنفيذ</option>
                    <option value="completed">مكتمل</option>
                    <option value="cancelled">ملغى</option>
                  </>
                )}
                {activeTab === 'equipment' && (
                  <>
                    <option value="available">متاحة</option>
                    <option value="maintenance">تحت الصيانة</option>
                    <option value="damaged">تالفة</option>
                    <option value="lost">مفقودة</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text mb-1">البحث</label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ابحث برقم العداد، العميل، أو الفاتورة..."
                  className="w-full p-2.5 ps-9 bg-surface border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <Search size={16} className="absolute top-3 right-3 text-text-muted" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 border border-border rounded-xl text-xs font-bold hover:bg-surface-container-high transition-colors"
            >
              إعادة تعيين
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-6 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-sm hover:opacity-90 transition-opacity"
            >
              تطبيق الفلاتر
            </button>
          </div>
        </div>
      )}

      {/* Printable Area Wrapper */}
      <div id="report-printable-area" className="space-y-6">
        {/* Printable Report Header */}
        <div className="hidden print:flex items-center justify-between border-b pb-4 mb-6">
          <div className="flex items-center gap-3">
            <BrandLogo variant="dark" size="md" />
            <div>
              <h2 className="text-xl font-bold text-primary">شركة البرق لإدارة محطات الكهرباء</h2>
              <p className="text-xs text-gray-500">تقرير إداري رسمي - {REPORT_TABS.find(t => t.id === activeTab)?.label}</p>
            </div>
          </div>
          <div className="text-left text-xs text-gray-500">
            <p>تاريخ الإنشاء: {formatDate(new Date(), 'long')}</p>
            <p>المشغّل: Admin User</p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm font-bold flex justify-between items-center">
            <span>{error}</span>
            <button onClick={fetchReport} className="underline text-xs">إعادة المحاولة</button>
          </div>
        )}

        {/* ── Comprehensive Report Dashboard Layout ────────────────────────────── */}
        {activeTab === 'comprehensive' && reportResponse?.overview ? (
          <div className="space-y-6">
            {/* Section 1: Top Metrics Overview */}
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm space-y-4">
              <h3 className="font-bold text-lg text-primary border-b border-border pb-2 flex items-center gap-2">
                <PieChart size={20} />
                <span>نظرة عامة ومؤشرات محطات الكهرباء</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card title="إجمالي العملاء" value={`${reportResponse.overview.total_customers} عميل`} color="blue" />
                <Card title="إجمالي العدادات النشطة" value={`${reportResponse.overview.active_meters} / ${reportResponse.overview.total_meters}`} color="emerald" />
                <Card title="إجمالي استهلاك الطاقة" value={`${reportResponse.overview.total_consumption_kwh} kWh`} color="amber" />
                <Card title="إجمالي الفواتير" value={`${reportResponse.overview.total_invoices} فاتورة`} />
              </div>
            </div>

            {/* Section 2: Financial Performance */}
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm space-y-4">
              <h3 className="font-bold text-lg text-primary border-b border-border pb-2 flex items-center gap-2">
                <DollarSign size={20} />
                <span>الملخص والتحليل المالي</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card title="المبالغ المفوترة الإجمالية" value={formatCurrency(reportResponse.overview.total_billed_amount)} color="blue" />
                <Card title="إجمالي المبالغ المحصلة" value={formatCurrency(reportResponse.overview.total_collected_amount)} color="emerald" />
                <Card title="إجمالي المستحقات المتبقية" value={formatCurrency(reportResponse.overview.total_remaining_amount)} color="red" />
              </div>
            </div>

            {/* Section 3: Operations & Workforce */}
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm space-y-4">
              <h3 className="font-bold text-lg text-primary border-b border-border pb-2 flex items-center gap-2">
                <Headset size={20} />
                <span>طلبات الخدمة والمعدات والقوى العاملة</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card title="طلبات الخدمة المكتملة" value={`${reportResponse.overview.completed_service_requests} / ${reportResponse.overview.total_service_requests}`} color="emerald" />
                <Card title="إجمالي المعدات والأصول" value={`${reportResponse.overview.total_equipment} معدة`} color="purple" />
                <Card title="إجمالي الموظفين بالنظام" value={`${reportResponse.overview.total_employees} موظف`} color="blue" />
              </div>
            </div>
          </div>
        ) : (
          /* Stats Cards Section for normal reports */
          isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-surface rounded-2xl border border-border"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeTab === 'customers' && (
                <>
                  <Card title="إجمالي العملاء" value={stats.total_customers ?? 0} />
                  <Card title="العملاء الجدد بالفترة" value={stats.new_in_period ?? 0} />
                  <Card title="سكني" value={stats.residential_count ?? 0} />
                  <Card title="تجاري / صناعي" value={(stats.commercial_count || 0) + (stats.industrial_count || 0)} />
                </>
              )}
              {activeTab === 'meters' && (
                <>
                  <Card title="إجمالي العدادات" value={stats.total_meters ?? 0} />
                  <Card title="عدادات نشطة" value={stats.active_meters ?? 0} color="emerald" />
                  <Card title="عدادات مفصولة" value={stats.disconnected_meters ?? 0} color="red" />
                  <Card title="تحت الصيانة / تالفة" value={(stats.maintenance_meters || 0) + (stats.damaged_meters || 0)} color="amber" />
                </>
              )}
              {activeTab === 'readings' && (
                <>
                  <Card title="إجمالي القراءات" value={stats.total_readings ?? 0} />
                  <Card title="قراءات معتمدة" value={stats.approved_readings ?? 0} color="emerald" />
                  <Card title="إجمالي الاستهلاك" value={`${stats.total_consumption_kwh ?? 0} kWh`} />
                  <Card title="التكلفة الإجمالية" value={formatCurrency(stats.total_consumption_cost)} color="blue" />
                </>
              )}
              {activeTab === 'consumption' && (
                <>
                  <Card title="إجمالي الاستهلاك" value={`${stats.total_consumption ?? 0} kWh`} />
                  <Card title="متوسط الاستهلاك" value={`${stats.average_consumption ?? 0} kWh`} color="blue" />
                  <Card title="أعلى قراءة استهلاك" value={`${stats.max_consumption ?? 0} kWh`} color="amber" />
                  <Card title="أدنى قراءة استهلاك" value={`${stats.min_consumption ?? 0} kWh`} color="emerald" />
                </>
              )}
              {activeTab === 'invoices' && (
                <>
                  <Card title="إجمالي الفواتير" value={stats.total_invoices ?? 0} />
                  <Card title="إجمالي القيمة" value={formatCurrency(stats.total_amount)} />
                  <Card title="المحصل" value={formatCurrency(stats.paid_amount)} color="emerald" />
                  <Card title="المتبقي" value={formatCurrency(stats.remaining_amount)} color="red" />
                </>
              )}
              {activeTab === 'collections' && (
                <>
                  <Card title="إجمالي التحصيلات" value={formatCurrency(stats.total_collected)} color="emerald" />
                  <Card title="تحصيلات اليوم" value={formatCurrency(stats.collections_today)} />
                  <Card title="تحصيلات الشهر" value={formatCurrency(stats.collections_this_month)} color="blue" />
                  <Card title="عدد عمليات التحصيل" value={stats.collections_count ?? 0} />
                </>
              )}
              {activeTab === 'revenue' && (
                <>
                  <Card title="إجمالي الإيرادات" value={formatCurrency(stats.total_revenue)} color="emerald" />
                  <Card title="إيرادات اليوم" value={formatCurrency(stats.today_revenue)} />
                  <Card title="إيرادات الشهر" value={formatCurrency(stats.month_revenue)} color="blue" />
                  <Card title="إيرادات السنة" value={formatCurrency(stats.year_revenue)} color="purple" />
                </>
              )}
              {activeTab === 'service-requests' && (
                <>
                  <Card title="إجمالي الطلبات" value={stats.total_requests ?? 0} />
                  <Card title="قيد الانتظار / مسند" value={(stats.pending_count || 0) + (stats.assigned_count || 0)} color="amber" />
                  <Card title="قيد التنفيذ" value={stats.in_progress_count ?? 0} color="blue" />
                  <Card title="مكتملة" value={stats.completed_count ?? 0} color="emerald" />
                </>
              )}
              {activeTab === 'equipment' && (
                <>
                  <Card title="إجمالي المعدات" value={stats.total_equipment ?? 0} />
                  <Card title="متاحة" value={stats.available_count ?? 0} color="emerald" />
                  <Card title="تحت الصيانة" value={stats.maintenance_count ?? 0} color="amber" />
                  <Card title="تالفة / مفقودة" value={(stats.damaged_count || 0) + (stats.lost_count || 0)} color="red" />
                </>
              )}
              {activeTab === 'employees' && (
                <>
                  <Card title="إجمالي الموظفين" value={stats.total_employees ?? 0} />
                  <Card title="المهندسين" value={stats.engineer_count ?? 0} color="blue" />
                  <Card title="القراء" value={stats.reader_count ?? 0} color="emerald" />
                  <Card title="المحاسبين" value={stats.accountant_count ?? 0} color="purple" />
                </>
              )}
            </div>
          )
        )}

        {/* Charts Section with Arabic Legends */}
        {(activeTab === 'revenue' || activeTab === 'consumption') && reportResponse && (
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm no-print">
            <h3 className="font-bold text-primary text-base mb-4">
              {activeTab === 'revenue' ? 'التحليل الشهري للإيرادات والمبالغ المفوترة' : 'التحليل الشهري لاستهلاك الطاقة'}
            </h3>
            <div className="h-[300px] w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                {activeTab === 'revenue' ? (
                  <BarChart data={reportResponse.chart_data || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: any, name: any) => [formatCurrency(value), name === 'billed' ? 'المفوتر' : 'المحصل']} />
                    <Legend formatter={(val) => (val === 'collected' ? 'المحصل' : 'المفوتر')} />
                    <Bar dataKey="billed" fill="#3b82f6" name="billed" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="collected" fill="#10b981" name="collected" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <AreaChart data={reportResponse.monthly_chart || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: any) => [`${value} kWh`, 'إجمالي الاستهلاك']} />
                    <Area type="monotone" dataKey="total" name="الاستهلاك (kWh)" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Data Table for ALL 10 Standard Reports */}
        {activeTab !== 'comprehensive' && (
          <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border font-bold text-primary flex justify-between items-center">
              <span>سجلات التقرير التفصيلية</span>
              <span className="text-xs text-text-muted">
                عرض {normalized.from} إلى {normalized.to} من إجمالي {normalized.total} نتيجة
              </span>
            </div>

            {isLoading ? (
              <div className="p-12 text-center text-text-muted">جاري تحميل البيانات...</div>
            ) : items.length === 0 ? (
              <div className="p-12 text-center text-text-muted font-bold">لا توجد بيانات ضمن الفترة والتصنيفات المحددة.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className={cn('w-full text-sm', isRTL ? 'text-right' : 'text-left')} dir={isRTL ? 'rtl' : 'ltr'}>
                  <thead className="bg-surface-container-low text-text-muted font-semibold border-b border-border">
                    <tr>
                      {activeTab === 'customers' && (
                        <>
                          <th className="p-4 whitespace-nowrap">رقم العميل</th>
                          <th className="p-4 whitespace-nowrap">اسم العميل</th>
                          <th className="p-4 whitespace-nowrap">النوع</th>
                          <th className="p-4 whitespace-nowrap">الهاتف</th>
                          <th className="p-4 whitespace-nowrap">العدادات</th>
                          <th className="p-4 whitespace-nowrap font-medium">تاريخ التسجيل</th>
                        </>
                      )}
                      {activeTab === 'meters' && (
                        <>
                          <th className="p-4 whitespace-nowrap">رقم العداد</th>
                          <th className="p-4 whitespace-nowrap">العميل</th>
                          <th className="p-4 whitespace-nowrap">QR Code</th>
                          <th className="p-4 whitespace-nowrap">موقع التركيب</th>
                          <th className="p-4 whitespace-nowrap">الحالة</th>
                          <th className="p-4 whitespace-nowrap font-medium">تاريخ التركيب</th>
                        </>
                      )}
                      {activeTab === 'readings' && (
                        <>
                          <th className="p-4 whitespace-nowrap">رقم العداد</th>
                          <th className="p-4 whitespace-nowrap">العميل</th>
                          <th className="p-4 whitespace-nowrap">السابقة</th>
                          <th className="p-4 whitespace-nowrap">الحالية</th>
                          <th className="p-4 whitespace-nowrap">الاستهلاك</th>
                          <th className="p-4 whitespace-nowrap">التكلفة</th>
                          <th className="p-4 whitespace-nowrap">طريقة القراءة</th>
                          <th className="p-4 whitespace-nowrap">الحالة</th>
                          <th className="p-4 whitespace-nowrap font-medium">التاريخ</th>
                        </>
                      )}
                      {activeTab === 'consumption' && (
                        <>
                          <th className="p-4 whitespace-nowrap">رقم العداد</th>
                          <th className="p-4 whitespace-nowrap">العميل</th>
                          <th className="p-4 whitespace-nowrap">الاستهلاك المسجل</th>
                          <th className="p-4 whitespace-nowrap font-medium">تاريخ القراءة</th>
                        </>
                      )}
                      {activeTab === 'invoices' && (
                        <>
                          <th className="p-4 whitespace-nowrap">رقم الفاتورة</th>
                          <th className="p-4 whitespace-nowrap">العميل</th>
                          <th className="p-4 whitespace-nowrap">المبلغ الإجمالي</th>
                          <th className="p-4 whitespace-nowrap">المدفوع</th>
                          <th className="p-4 whitespace-nowrap">المتبقي</th>
                          <th className="p-4 whitespace-nowrap">الحالة</th>
                          <th className="p-4 whitespace-nowrap font-medium">تاريخ الإصدار</th>
                        </>
                      )}
                      {activeTab === 'collections' && (
                        <>
                          <th className="p-4 whitespace-nowrap">رقم الفاتورة</th>
                          <th className="p-4 whitespace-nowrap">العميل</th>
                          <th className="p-4 whitespace-nowrap">رقم العداد</th>
                          <th className="p-4 whitespace-nowrap">المبلغ قبل السداد</th>
                          <th className="p-4 whitespace-nowrap">المبلغ المدفوع</th>
                          <th className="p-4 whitespace-nowrap">المتبقي</th>
                          <th className="p-4 whitespace-nowrap">المحاسب</th>
                          <th className="p-4 whitespace-nowrap font-medium">تاريخ التحصيل</th>
                        </>
                      )}
                      {activeTab === 'revenue' && (
                        <>
                          <th className="p-4 whitespace-nowrap">رقم الفاتورة / المرجع</th>
                          <th className="p-4 whitespace-nowrap">العميل</th>
                          <th className="p-4 whitespace-nowrap">المبلغ المفوتر</th>
                          <th className="p-4 whitespace-nowrap">الإيراد المحصل</th>
                          <th className="p-4 whitespace-nowrap">المتبقي</th>
                          <th className="p-4 whitespace-nowrap font-medium">تاريخ المعاملة</th>
                        </>
                      )}
                      {activeTab === 'service-requests' && (
                        <>
                          <th className="p-4 whitespace-nowrap">رقم الطلب</th>
                          <th className="p-4 whitespace-nowrap">العميل</th>
                          <th className="p-4 whitespace-nowrap">العداد</th>
                          <th className="p-4 whitespace-nowrap">النوع</th>
                          <th className="p-4 whitespace-nowrap">الأولوية</th>
                          <th className="p-4 whitespace-nowrap">الحالة</th>
                          <th className="p-4 whitespace-nowrap">المهندس المسؤول</th>
                          <th className="p-4 whitespace-nowrap font-medium">التاريخ</th>
                        </>
                      )}
                      {activeTab === 'equipment' && (
                        <>
                          <th className="p-4 whitespace-nowrap">اسم المعدة</th>
                          <th className="p-4 whitespace-nowrap">الرقم التسلسلي</th>
                          <th className="p-4 whitespace-nowrap">الحالة</th>
                          <th className="p-4 whitespace-nowrap">المسند إليه</th>
                          <th className="p-4 whitespace-nowrap font-medium">تاريخ الإضافة</th>
                        </>
                      )}
                      {activeTab === 'employees' && (
                        <>
                          <th className="p-4 whitespace-nowrap">اسم الموظف</th>
                          <th className="p-4 whitespace-nowrap">البريد الإلكتروني</th>
                          <th className="p-4 whitespace-nowrap">الدور</th>
                          <th className="p-4 whitespace-nowrap font-medium">تاريخ الإنشاء</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {items.map((row: any) => (
                      <tr key={row.id} className="hover:bg-surface-container-lowest transition-colors">
                        {activeTab === 'customers' && (
                          <>
                            <td className="p-4 font-bold text-primary whitespace-nowrap">{row.customer_number || `CUST-${row.id}`}</td>
                            <td className="p-4 whitespace-nowrap font-bold text-text">{row.full_name}</td>
                            <td className="p-4 whitespace-nowrap">{row.customer_type === 'residential' ? 'سكني' : (row.customer_type === 'commercial' ? 'تجاري' : 'صناعي')}</td>
                            <td className="p-4 whitespace-nowrap" dir="ltr">{row.phone || '-'}</td>
                            <td className="p-4 font-bold whitespace-nowrap">{row.meters_count ?? 0}</td>
                            <td className="p-4 text-text-muted whitespace-nowrap">{formatDate(row.created_at)}</td>
                          </>
                        )}
                        {activeTab === 'meters' && (
                          <>
                            <td className="p-4 font-bold text-primary whitespace-nowrap">{row.meter_number}</td>
                            <td className="p-4 whitespace-nowrap font-bold text-text">{row.customer?.full_name || '-'}</td>
                            <td className="p-4 font-mono text-xs whitespace-nowrap">{row.qr_code || '-'}</td>
                            <td className="p-4 whitespace-nowrap">{row.installation_location || '-'}</td>
                            <td className="p-4 whitespace-nowrap">
                              <span className={cn('px-2.5 py-1 rounded-full text-xs font-bold', row.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')}>
                                {row.status === 'active' ? 'نشط' : (row.status === 'disconnected' ? 'مفصول' : row.status)}
                              </span>
                            </td>
                            <td className="p-4 text-text-muted whitespace-nowrap">{formatDate(row.installation_date || row.created_at)}</td>
                          </>
                        )}
                        {activeTab === 'readings' && (
                          <>
                            <td className="p-4 font-bold text-primary whitespace-nowrap">{row.meter?.meter_number || '-'}</td>
                            <td className="p-4 whitespace-nowrap font-bold text-text">{row.meter?.customer?.full_name || '-'}</td>
                            <td className="p-4 whitespace-nowrap">{row.previous_reading ?? 0}</td>
                            <td className="p-4 whitespace-nowrap">{row.current_reading ?? 0}</td>
                            <td className="p-4 font-bold text-emerald-700 whitespace-nowrap">{row.consumption ?? 0} kWh</td>
                            <td className="p-4 whitespace-nowrap font-bold">{formatCurrency(row.reading_cost ?? row.total_cost)}</td>
                            <td className="p-4 whitespace-nowrap">{row.reading_method === 'qr_scan' ? 'مسح QR' : 'يدوية'}</td>
                            <td className="p-4 whitespace-nowrap">
                              <span className={cn('px-2.5 py-1 rounded-full text-xs font-bold',
                                row.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : (row.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700')
                              )}>
                                {row.status === 'approved' ? 'معتمد' : (row.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة')}
                              </span>
                            </td>
                            <td className="p-4 text-text-muted whitespace-nowrap">{formatDate(row.reading_date || row.created_at)}</td>
                          </>
                        )}
                        {activeTab === 'consumption' && (
                          <>
                            <td className="p-4 font-bold text-primary whitespace-nowrap">{row.meter?.meter_number || '-'}</td>
                            <td className="p-4 whitespace-nowrap font-bold text-text">{row.meter?.customer?.full_name || '-'}</td>
                            <td className="p-4 font-bold text-emerald-700 whitespace-nowrap">{row.consumption ?? 0} kWh</td>
                            <td className="p-4 text-text-muted whitespace-nowrap">{formatDate(row.reading_date || row.created_at)}</td>
                          </>
                        )}
                        {activeTab === 'invoices' && (
                          <>
                            <td className="p-4 font-bold text-primary whitespace-nowrap">{row.invoice_number}</td>
                            <td className="p-4 whitespace-nowrap font-bold text-text">{row.customer?.full_name || '-'}</td>
                            <td className="p-4 font-bold whitespace-nowrap">{formatCurrency(row.outstanding_before_payment ?? row.total_amount)}</td>
                            <td className="p-4 text-emerald-700 font-bold whitespace-nowrap">{formatCurrency(row.paid_amount)}</td>
                            <td className="p-4 text-red-600 font-bold whitespace-nowrap">{formatCurrency(row.remaining_balance ?? row.remaining_amount)}</td>
                            <td className="p-4 whitespace-nowrap">
                              <span className={cn('px-2.5 py-1 rounded-full text-xs font-bold', row.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : (row.status === 'partially_paid' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'))}>
                                {row.status === 'paid' ? 'مدفوعة' : (row.status === 'partially_paid' ? 'مدفوعة جزئياً' : 'غير مدفوعة')}
                              </span>
                            </td>
                            <td className="p-4 text-text-muted whitespace-nowrap">{formatDate(row.created_at)}</td>
                          </>
                        )}
                        {activeTab === 'collections' && (
                          <>
                            <td className="p-4 font-bold text-primary whitespace-nowrap">{row.invoice_number}</td>
                            <td className="p-4 whitespace-nowrap font-bold text-text">{row.customer?.full_name || '-'}</td>
                            <td className="p-4 whitespace-nowrap font-bold">{row.consumption_charge?.meter?.meter_number || row.meter?.meter_number || '-'}</td>
                            <td className="p-4 font-bold whitespace-nowrap">{formatCurrency(row.outstanding_before_payment ?? row.total_amount)}</td>
                            <td className="p-4 text-emerald-700 font-bold whitespace-nowrap">{formatCurrency(row.paid_amount)}</td>
                            <td className="p-4 text-red-600 font-bold whitespace-nowrap">{formatCurrency(row.remaining_balance ?? row.remaining_amount)}</td>
                            <td className="p-4 whitespace-nowrap">{row.accountant?.name || '-'}</td>
                            <td className="p-4 text-text-muted whitespace-nowrap">{formatDate(row.updated_at || row.created_at)}</td>
                          </>
                        )}
                        {activeTab === 'revenue' && (
                          <>
                            <td className="p-4 font-bold text-primary whitespace-nowrap">{row.invoice_number || `REV-${row.id}`}</td>
                            <td className="p-4 whitespace-nowrap font-bold text-text">{row.customer?.full_name || '-'}</td>
                            <td className="p-4 font-bold whitespace-nowrap">{formatCurrency(row.outstanding_before_payment ?? row.total_amount)}</td>
                            <td className="p-4 text-emerald-700 font-bold whitespace-nowrap">{formatCurrency(row.paid_amount)}</td>
                            <td className="p-4 text-red-600 font-bold whitespace-nowrap">{formatCurrency(row.remaining_balance ?? row.remaining_amount)}</td>
                            <td className="p-4 text-text-muted whitespace-nowrap">{formatDate(row.updated_at || row.created_at)}</td>
                          </>
                        )}
                        {activeTab === 'service-requests' && (
                          <>
                            <td className="p-4 font-bold text-primary whitespace-nowrap">SR-{String(row.id).padStart(4, '0')}</td>
                            <td className="p-4 whitespace-nowrap font-bold text-text">{row.customer?.full_name || '-'}</td>
                            <td className="p-4 whitespace-nowrap">{row.meter?.meter_number || '-'}</td>
                            <td className="p-4 whitespace-nowrap">{row.request_type === 'maintenance' ? 'صيانة' : row.request_type}</td>
                            <td className="p-4 whitespace-nowrap">{row.priority === 'emergency' ? 'طارئة' : (row.priority === 'high' ? 'عالية' : 'متوسطة')}</td>
                            <td className="p-4 whitespace-nowrap">
                              <span className={cn('px-2.5 py-1 rounded-full text-xs font-bold',
                                row.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : (row.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : (row.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'))
                              )}>
                                {row.status === 'completed' ? 'مكتمل' : (row.status === 'in_progress' ? 'قيد التنفيذ' : (row.status === 'assigned' ? 'مسند' : (row.status === 'cancelled' ? 'ملغى' : 'قيد الانتظار')))}
                              </span>
                            </td>
                            <td className="p-4 whitespace-nowrap">{row.assigned_engineer?.name || row.assignedEngineer?.name || 'غير مسند'}</td>
                            <td className="p-4 text-text-muted whitespace-nowrap">{formatDate(row.created_at)}</td>
                          </>
                        )}
                        {activeTab === 'equipment' && (
                          <>
                            <td className="p-4 font-bold text-primary whitespace-nowrap">{row.equipment_name}</td>
                            <td className="p-4 font-mono text-xs whitespace-nowrap">{row.serial_number || '-'}</td>
                            <td className="p-4 whitespace-nowrap">
                              <span className={cn('px-2.5 py-1 rounded-full text-xs font-bold', row.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')}>
                                {row.status === 'available' ? 'متاحة' : (row.status === 'maintenance' ? 'تحت الصيانة' : row.status)}
                              </span>
                            </td>
                            <td className="p-4 whitespace-nowrap">{row.user?.name || 'غير مسند'}</td>
                            <td className="p-4 text-text-muted whitespace-nowrap">{formatDate(row.created_at)}</td>
                          </>
                        )}
                        {activeTab === 'employees' && (
                          <>
                            <td className="p-4 font-bold text-primary whitespace-nowrap">{row.name}</td>
                            <td className="p-4 whitespace-nowrap" dir="ltr">{row.email}</td>
                            <td className="p-4 whitespace-nowrap font-bold text-indigo-700">{row.roles?.[0]?.name === 'admin' ? 'مدير نظام' : (row.roles?.[0]?.name === 'engineer' ? 'مهندس' : (row.roles?.[0]?.name === 'reader' ? 'قارئ' : 'محاسب'))}</td>
                            <td className="p-4 text-text-muted whitespace-nowrap">{formatDate(row.created_at)}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {normalized.lastPage > 1 && (
              <div className="p-4 border-t border-border flex justify-between items-center no-print">
                <button
                  disabled={normalized.currentPage <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-4 py-1.5 border border-border rounded-xl text-xs font-bold disabled:opacity-40 hover:bg-surface-container-high transition-colors"
                >
                  السابق
                </button>
                <span className="text-xs text-text font-bold">صفحة {normalized.currentPage} من {normalized.lastPage}</span>
                <button
                  disabled={normalized.currentPage >= normalized.lastPage}
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-1.5 border border-border rounded-xl text-xs font-bold disabled:opacity-40 hover:bg-surface-container-high transition-colors"
                >
                  التالي
                </button>
              </div>
            )}
          </div>
        )}

        {/* Print Footer */}
        <div className="hidden print:block pt-8 border-t text-xs text-gray-500 flex justify-between">
          <span>شركة البرق لإدارة محطات الكهرباء - جميع الحقوق محفوظة</span>
          <span>صفحة 1 من 1</span>
        </div>
      </div>
    </div>
  )
}

function Card({ title, value, color }: { title: string; value: string | number; color?: string }) {
  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-700 border-emerald-200 bg-emerald-50/50',
    red: 'text-red-700 border-red-200 bg-red-50/50',
    amber: 'text-amber-700 border-amber-200 bg-amber-50/50',
    blue: 'text-blue-700 border-blue-200 bg-blue-50/50',
    purple: 'text-purple-700 border-purple-200 bg-purple-50/50',
  }

  const borderStyle = color ? colorMap[color] || '' : 'bg-surface border-border'

  return (
    <div className={cn('p-5 rounded-2xl border shadow-sm transition-all', borderStyle)}>
      <p className="text-xs font-bold text-text-muted">{title}</p>
      <p className="text-xl font-headline font-bold text-text mt-2">{value}</p>
    </div>
  )
}
