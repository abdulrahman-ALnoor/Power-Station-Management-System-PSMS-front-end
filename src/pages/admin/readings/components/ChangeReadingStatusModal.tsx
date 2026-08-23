import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/hooks/useLanguage'
import { MeterReading, ReadingStatus } from '../../../shared/readings/types'
import { ReadingStatusBadge } from '../../../shared/readings/components/ReadingStatusBadge'

interface ChangeReadingStatusModalProps {
 isOpen: boolean
 onClose: () => void
 reading: MeterReading | null
 onSave: (readingId: number, newStatus: ReadingStatus) => void
}

export function ChangeReadingStatusModal({ isOpen, onClose, reading, onSave }: ChangeReadingStatusModalProps) {
 const { t } = useTranslation('readings')
 const { isRTL } = useLanguage()

 const [selectedStatus, setSelectedStatus] = useState<ReadingStatus>('pending')

 useEffect(() => {
 if (reading && reading.status) {
 setSelectedStatus(reading.status)
 }
 }, [reading, isOpen])

 if (!isOpen || !reading) return null

 const isSameStatus = reading.status === selectedStatus

 const handleSave = () => {
 if (!isSameStatus) {
 onSave(reading.id, selectedStatus)
 }
 }

 return createPortal(
 <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
 {/* BACKDROP */}
 <div
 onClick={onClose}
 style={{
 position: 'absolute',
 inset: 0,
 backgroundColor: 'rgba(0,0,0,0.4)',
 zIndex: 0,
 }}
 />

 {/* MODAL */}
 <aside
 className="absolute inset-0 flex items-center justify-center p-4 sm:p-6"
 style={{ zIndex: 1 }}
 dir={isRTL ? 'rtl' : 'ltr'}
 >
 <div
 className="w-full max-w-md rounded-2xl shadow-2xl border border-border flex flex-col max-h-[calc(100vh-32px)] overflow-hidden"
 style={{
 backgroundColor: '#ffffff',
 opacity: 1,
 filter: 'none'
 }}
 >
 {/* Header */}
 <div className="flex items-center justify-between p-6 border-b border-border">
 <div>
 <h2 className="font-headline-sm text-xl font-semibold text-text-primary flex items-center gap-2">
 <RefreshCw size={20} className="text-primary" />
 {isRTL ? 'تغيير حالة القراءة' : 'Change Reading Status'}
 </h2>
 </div>
 <button
 onClick={onClose}
 aria-label={isRTL ? 'إغلاق' : 'Close'}
 className="p-2 rounded-full hover:bg-surface-container :bg-surface-container transition-colors text-text-muted"
 >
 <X size={20} />
 </button>
 </div>

 <div className="flex-1 overflow-y-auto p-6 space-y-6">
 {/* Reading Info Summary */}
 <div className="bg-surface-low border border-border rounded-xl p-4 text-sm space-y-3">
 <div className="flex justify-between items-center">
 <span className="text-text-muted ">{isRTL ? 'رقم القراءة:' : 'Reading ID:'}</span>
 <span className="font-bold text-text-primary " dir="ltr">#{reading.id}</span>
 </div>
 <div className="flex justify-between items-center">
 <span className="text-text-muted ">{isRTL ? 'رقم العداد:' : 'Meter Number:'}</span>
 <span className="font-bold text-text-primary ">{reading.meter?.meter_number || reading.meter_id}</span>
 </div>
 <div className="flex justify-between items-center">
 <span className="text-text-muted ">{isRTL ? 'الحالة الحالية:' : 'Current Status:'}</span>
 <ReadingStatusBadge status={reading.status} />
 </div>
 </div>

 {/* Status Selection */}
 <div className="space-y-4">
 <h3 className="text-sm font-semibold text-primary ">
 {isRTL ? 'الحالة الجديدة' : 'New Status'}
 </h3>

 <div className="space-y-3">
 {(['pending', 'approved', 'rejected'] as ReadingStatus[]).map((statusValue) => (
 <label
 key={statusValue}
 className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
 selectedStatus === statusValue
 ? 'border-primary bg-primary/5 '
 : 'border-border hover:border-border hover:bg-surface-low :bg-surface-container/30'
 }`}
 >
 <input
 type="radio"
 name="reading_status"
 value={statusValue}
 checked={selectedStatus === statusValue}
 onChange={() => setSelectedStatus(statusValue)}
 className="w-4 h-4 text-primary focus:ring-primary"
 />
 <div className="flex-1">
 <ReadingStatusBadge status={statusValue} />
 </div>
 </label>
 ))}
 </div>
 </div>

 {isSameStatus && (
 <p className="text-xs text-text-muted italic text-center">
 {isRTL ? 'الحالة الحالية هي نفسها الحالة الجديدة.' : 'The new status is the same as the current status.'}
 </p>
 )}
 </div>

 <div className="p-6 pt-4 border-t border-border bg-surface flex items-center justify-end gap-3 shrink-0">
 <button
 onClick={onClose}
 className="px-6 py-2.5 rounded-lg border border-border text-text-primary font-semibold hover:bg-surface-container :bg-surface-container transition-colors min-h-[44px]"
 >
 {isRTL ? 'إلغاء' : 'Cancel'}
 </button>
 <button
 onClick={handleSave}
 disabled={isSameStatus}
 className="px-6 py-2.5 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
 >
 {isRTL ? 'حفظ التغيير' : 'Save Changes'}
 </button>
 </div>

 </div>
 </aside>
 </div>,
 document.body
 )
}
