import React, { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { MeterReading } from './types'
import { MOCK_METER_READINGS, getMeterReadingStats } from './data/mockData'
import { MeterReadingStats } from './components/MeterReadingStats'
import { MeterReadingToolbar } from './components/MeterReadingToolbar'
import { MeterReadingTable } from './components/MeterReadingTable'
import { MeterReadingDetailsDrawer } from './components/MeterReadingDetailsDrawer'
import { AddMeterReadingModal } from './components/AddMeterReadingModal'

export function MeterReadingsManagementPage() {
  const { t } = useTranslation('readings')
  const { isRTL } = useLanguage()

  const [readings, setReadings] = useState<MeterReading[]>(MOCK_METER_READINGS)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [methodFilter, setMethodFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  const [selectedReading, setSelectedReading] = useState<MeterReading | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const stats = useMemo(() => getMeterReadingStats(readings), [readings])

  const filteredReadings = useMemo(() => {
    return readings.filter(reading => {
      const matchesSearch = 
        reading.id.toString().includes(searchQuery) ||
        reading.meter?.meter_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reading.meter_id.toString().includes(searchQuery)
      
      const matchesStatus = statusFilter === 'all' || reading.status === statusFilter
      const matchesMethod = methodFilter === 'all' || reading.reading_method === methodFilter
      
      let matchesDate = true
      if (dateFilter !== 'all') {
        const readingDate = new Date(reading.reading_date)
        const today = new Date()
        if (dateFilter === 'today') {
          matchesDate = readingDate.toDateString() === today.toDateString()
        } else if (dateFilter === 'this_week') {
          const firstDay = new Date(today.setDate(today.getDate() - today.getDay()))
          matchesDate = readingDate >= firstDay
        } else if (dateFilter === 'this_month') {
          matchesDate = readingDate.getMonth() === today.getMonth() && readingDate.getFullYear() === today.getFullYear()
        }
      }

      return matchesSearch && matchesStatus && matchesMethod && matchesDate
    })
  }, [readings, searchQuery, statusFilter, methodFilter, dateFilter])

  const handleViewDetails = (reading: MeterReading) => {
    setSelectedReading(reading)
    setIsDetailsOpen(true)
  }

  const handleAddReading = (newReadingData: Omit<MeterReading, 'id' | 'created_at' | 'updated_at' | 'status' | 'created_by'>) => {
    const newReading: MeterReading = {
      ...newReadingData,
      id: Math.max(...readings.map(r => r.id)) + 1,
      created_by: 1, // Mock user ID
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      meter: { id: newReadingData.meter_id, meter_number: `MET-${newReadingData.meter_id}` },
      createdBy: { id: 1, name: 'Current User' }
    }
    
    setReadings([newReading, ...readings])
    setIsAddModalOpen(false)
    setNotification({ type: 'success', message: t('notifications.added') })
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
          <h1 className="font-headline-md text-headline-md font-bold text-primary dark:text-on-dark">
            {t('pageTitle')}
          </h1>
          <p className="text-label-md text-outline dark:text-outline/80 mt-1">
            {t('pageSubtitle')}
          </p>
          <nav 
            className="flex gap-2 text-label-sm text-outline/60 dark:text-outline/50 mt-2"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <span>{t('breadcrumb.home')}</span>
            <span>/</span>
            <span>{t('breadcrumb.readings')}</span>
          </nav>
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

      <MeterReadingStats stats={stats} />

      <MeterReadingToolbar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        methodFilter={methodFilter}
        onMethodFilterChange={setMethodFilter}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        onAddClick={() => setIsAddModalOpen(true)}
        onRefresh={() => setReadings(MOCK_METER_READINGS)}
      />

      <MeterReadingTable 
        data={filteredReadings}
        onViewDetails={handleViewDetails}
        onEdit={(r) => console.log('Edit', r.id)}
        onDelete={(r) => console.log('Delete', r.id)}
      />

      <MeterReadingDetailsDrawer 
        reading={selectedReading}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />

      <AddMeterReadingModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddReading}
      />
    </div>
  )
}
