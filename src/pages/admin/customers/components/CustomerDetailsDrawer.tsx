import { useState, useEffect } from 'react'
import { X, User, Phone, MapPin, Gauge, DollarSign, Calendar, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { fetchCustomerDetails, CustomerDetailsData, CustomerApiRecord } from '@/services/customers.service'

interface CustomerDetailsDrawerProps {
  customer: CustomerApiRecord | null
  isOpen: boolean
  onClose: () => void
}

export function CustomerDetailsDrawer({ customer, isOpen, onClose }: CustomerDetailsDrawerProps) {
  const [details, setDetails] = useState<CustomerDetailsData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && customer) {
      setLoading(true)
      fetchCustomerDetails(customer.id)
        .then((res) => setDetails(res))
        .finally(() => setLoading(false))
    } else {
      setDetails(null)
    }
  }, [isOpen, customer])

  if (!isOpen || !customer) return null

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
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className="fixed inset-y-0 right-0 w-full max-w-xl bg-surface text-text shadow-2xl flex flex-col z-10 transition-transform duration-300"
        dir="rtl"
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex justify-between items-center bg-surface-low">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
              <User size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-primary">{customer.full_name}</h3>
              <p className="text-xs text-text-muted mt-0.5">
                رقم العميل: <span dir="ltr">{customer.customer_number || `CUST-${customer.id}`}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-text-muted hover:text-text"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Info */}
          <div className="bg-surface-low rounded-xl border border-border p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-xs font-semibold text-text-muted">نوع الاشتراط / العميل</span>
              {getCustomerTypeBadge(customer.customer_type)}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-text-muted" />
                <div>
                  <div className="text-[11px] text-text-muted">رقم الهاتف</div>
                  <div className="font-semibold text-text" dir="ltr">{customer.phone || 'غير مسجل'}</div>
                </div>
              </div>
              {customer.alternative_phone && (
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-text-muted" />
                  <div>
                    <div className="text-[11px] text-text-muted">هاتف بديل</div>
                    <div className="font-semibold text-text" dir="ltr">{customer.alternative_phone}</div>
                  </div>
                </div>
              )}
            </div>

            {customer.address_description && (
              <div className="flex items-start gap-2 pt-2 border-t border-border text-sm">
                <MapPin size={16} className="text-text-muted shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] text-text-muted">العنوان والمنطقة</div>
                  <div className="text-text font-medium mt-0.5">{customer.address_description}</div>
                </div>
              </div>
            )}

            {customer.notes && (
              <div className="flex items-start gap-2 pt-2 border-t border-border text-sm">
                <FileText size={16} className="text-text-muted shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] text-text-muted">ملاحظات العميل</div>
                  <div className="text-text-muted text-xs mt-0.5">{customer.notes}</div>
                </div>
              </div>
            )}
          </div>

          {/* Statistics Summary */}
          {loading ? (
            <div className="p-6 text-center text-text-muted animate-pulse">جاري تحميل إحصائيات العميل...</div>
          ) : details ? (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                  <Gauge size={20} className="mx-auto text-blue-600 mb-1" />
                  <div className="text-xs text-blue-800 font-medium">العدادات</div>
                  <div className="text-lg font-bold text-blue-900 mt-1">{details.statistics.meters_count}</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
                  <ZapIcon size={20} className="mx-auto text-emerald-600 mb-1" />
                  <div className="text-xs text-emerald-800 font-medium">إجمالي الاستهلاك</div>
                  <div className="text-lg font-bold text-emerald-900 mt-1">{details.statistics.total_consumption} <span className="text-xs">kWh</span></div>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
                  <DollarSign size={20} className="mx-auto text-amber-600 mb-1" />
                  <div className="text-xs text-amber-800 font-medium">المبلغ المستحق</div>
                  <div className="text-lg font-bold text-amber-900 mt-1">{details.statistics.outstanding_balance} <span className="text-xs">ر.س</span></div>
                </div>
              </div>

              {/* Linked Meters */}
              <div className="space-y-3">
                <h4 className="font-bold text-primary text-sm flex items-center gap-2">
                  <Gauge size={16} />
                  <span>العدادات المرتبطة بالعميل ({details.meters.length})</span>
                </h4>
                {details.meters.length === 0 ? (
                  <div className="text-xs text-text-muted bg-surface-low p-4 rounded-xl text-center">لا توجد عدادات مسجلة باسم هذا العميل.</div>
                ) : (
                  <div className="space-y-2">
                    {details.meters.map((meter: any) => (
                      <div key={meter.id} className="p-3 bg-surface-low rounded-xl border border-border flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-primary" dir="ltr">{meter.meter_number}</div>
                          <div className="text-text-muted mt-0.5">{meter.installation_location || 'الموقع غير محدد'}</div>
                        </div>
                        <Badge variant={meter.status === 'active' ? 'success' : meter.status === 'maintenance' ? 'warning' : 'neutral'}>
                          {meter.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function ZapIcon({ size, className }: { size: number, className: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}
