import { Search, Filter, Calendar, Plus } from 'lucide-react'
import { GetInvoicesParams } from './types'
import { useState } from 'react'
import { cn } from '@/utils/cn'

interface InvoiceToolbarProps {
 filters: GetInvoicesParams
 onFilterChange: (filters: GetInvoicesParams) => void
 onCreateClick?: () => void
}

export function InvoiceToolbar({ filters, onFilterChange, onCreateClick }: InvoiceToolbarProps) {
 const [localSearch, setLocalSearch] = useState(filters.search || '')

 const handleSearch = (e: React.FormEvent) => {
 e.preventDefault()
 onFilterChange({ ...filters, search: localSearch, page: 1 })
 }

 return (
 <div className="bg-surface p-4 rounded-xl shadow-sm border border-border flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
 
 <form onSubmit={handleSearch} className="relative w-full md:w-96">
 <input
 type="text"
 placeholder="ابحث برقم الفاتورة، اسم العميل، رقم العداد..."
 value={localSearch}
 onChange={(e) => setLocalSearch(e.target.value)}
 className="w-full bg-surface-container/50 border border-border rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text"
 />
 <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text">
 <Search size={18} />
 </button>
 </form>

 <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
 <div className="flex items-center gap-2 bg-surface-container/50 px-3 py-2 rounded-lg border border-border">
 <Filter size={16} className="text-text-muted" />
 <select
 value={filters.status || 'all'}
 onChange={(e) => onFilterChange({ ...filters, status: e.target.value, page: 1 })}
 className="bg-transparent border-none text-sm focus:ring-0 cursor-pointer text-text font-medium appearance-none"
 >
 <option value="all">جميع الحالات</option>
 <option value="paid">مدفوعة</option>
 <option value="partially_paid">مسددة جزئياً</option>
 <option value="unpaid">غير مدفوعة</option>
 <option value="overdue">متأخرة</option>
 </select>
 </div>

 <div className="flex items-center gap-3">
 <div className="relative flex items-center bg-surface-container/50 py-2 px-3 rounded-lg border border-border">
 <Calendar size={16} className="text-text-muted absolute right-3 pointer-events-none z-0" />
 <input
 type="date"
 value={filters.date_from || ''}
 onChange={(e) => onFilterChange({ ...filters, date_from: e.target.value, page: 1 })}
 className="bg-transparent border-none text-sm focus:ring-0 cursor-pointer text-text font-medium w-[130px] pr-6 pl-1 relative z-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
 />
 </div>
 
 <span className="text-text-muted text-xs font-medium">إلى</span>
 
 <div className="relative flex items-center bg-surface-container/50 py-2 px-3 rounded-lg border border-border">
 <Calendar size={16} className="text-text-muted absolute right-3 pointer-events-none z-0" />
 <input
 type="date"
 value={filters.date_to || ''}
 onChange={(e) => onFilterChange({ ...filters, date_to: e.target.value, page: 1 })}
 className="bg-transparent border-none text-sm focus:ring-0 cursor-pointer text-text font-medium w-[130px] pr-6 pl-1 relative z-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
 />
 </div>
 </div>

 {onCreateClick && (
 <button 
 onClick={onCreateClick}
 className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold text-sm transition-all shadow-sm active:scale-95"
 >
 <Plus size={18} />
 <span>إنشاء فاتورة</span>
 </button>
 )}
 </div>
 </div>
 )
}
