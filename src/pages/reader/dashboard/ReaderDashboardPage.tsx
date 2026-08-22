import React, { useState, useEffect } from 'react'
import i18n from '@/i18n'
import { AlertCircle } from 'lucide-react'
import { ReaderDashboardResponse } from './types/readerDashboard.types'
import { readerDashboardMockData } from './data/readerDashboardMockData'
import { ReaderStatsCards } from './components/ReaderStatsCards'
import { ReadingProgressCard } from './components/ReadingProgressCard'
import { ReadingConsumptionChart } from './components/ReadingConsumptionChart'
import { LatestReadingsCard } from './components/LatestReadingsCard'
import { ReaderQuickActions } from './components/ReaderQuickActions'
import { AddReadingModal } from '../shared/components/AddReadingModal'
import { CreateServiceRequestModal } from './components/CreateServiceRequestModal'

class ReaderDashboardErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
 constructor(props: { children: React.ReactNode }) {
 super(props)
 this.state = { hasError: false }
 }
 static getDerivedStateFromError() {
 return { hasError: true }
 }
 render() {
 if (this.state.hasError) {
 return (
 <div className="p-8 bg-surface text-center rounded-xl border border-border shadow-sm">
 <AlertCircle className="w-12 h-12 text-danger mx-auto mb-4" />
 <h2 className="text-xl font-bold mb-2 text-text">{i18n.t('errors.failedToLoad', { ns: 'reader' })}</h2>
 <button 
 onClick={() => window.location.reload()}
 className="px-4 py-2 bg-primary text-on-primary rounded-lg mt-4"
 >
 {i18n.t('errors.retry', { ns: 'reader' })}
 </button>
 </div>
 )
 }
 return this.props.children
 }
}

export function ReaderDashboardPage() {
 return (
 <ReaderDashboardErrorBoundary>
 <DashboardContent />
 </ReaderDashboardErrorBoundary>
 )
}

function DashboardContent() {
 const [data, setData] = useState<ReaderDashboardResponse | null>(null)
 const [loading, setLoading] = useState(true)

 const [isAddReadingOpen, setIsAddReadingOpen] = useState(false)
 const [isServiceRequestOpen, setIsServiceRequestOpen] = useState(false)

 useEffect(() => {
 let mounted = true
 const fetchData = async () => {
 try {
 // Simulate API call using the isolated mock data
 await new Promise(resolve => setTimeout(resolve, 800))
 if (mounted) {
 setData(readerDashboardMockData)
 setLoading(false)
 }
 } catch (err) {
 if (mounted) {
 setLoading(false)
 throw err // Caught by Error Boundary
 }
 }
 }
 fetchData()
 return () => { mounted = false }
 }, [])

 if (loading || !data) {
 return (
 <div className="space-y-6 max-w-[1440px] mx-auto pb-12 animate-pulse">
 <div className="h-8 w-48 bg-surface-container rounded mb-2"></div>
 <div className="h-4 w-64 bg-surface-container rounded"></div>
 
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
 {[1,2,3,4].map(i => <div key={i} className="h-24 bg-surface rounded-xl"></div>)}
 </div>
 
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
 <div className="lg:col-span-2 space-y-6">
 <div className="h-[250px] bg-surface rounded-xl"></div>
 <div className="h-[400px] bg-surface rounded-xl"></div>
 </div>
 <div className="space-y-6">
 <div className="h-[300px] bg-surface rounded-xl"></div>
 <div className="h-[200px] bg-surface rounded-xl"></div>
 </div>
 </div>
 </div>
 )
 }

 return (
 <div className="space-y-6 max-w-[1440px] mx-auto pb-12 animate-fade-in">
 {/* Top Statistics Row */}
 <ReaderStatsCards stats={data.stats} />

 {/* Middle Row: Charts */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 <div className="lg:col-span-1">
 <ReadingProgressCard progress={data.progress} />
 </div>
 <div className="lg:col-span-2">
 <ReadingConsumptionChart data={data.consumptionChart} />
 </div>
 </div>

 {/* Bottom Row: Table & Actions */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 <div className="lg:col-span-2">
 <LatestReadingsCard readings={data.latestReadings} />
 </div>
 <div className="lg:col-span-1">
 <ReaderQuickActions 
 onAddReadingClick={() => setIsAddReadingOpen(true)}
 onCreateRequestClick={() => setIsServiceRequestOpen(true)}
 />
 </div>
 </div>

 {/* Modals */}
 <AddReadingModal 
 isOpen={isAddReadingOpen}
 onClose={() => setIsAddReadingOpen(false)}
 onSuccess={() => console.log('AddReadingModal success!')}
 />
 <CreateServiceRequestModal 
 isOpen={isServiceRequestOpen}
 onClose={() => setIsServiceRequestOpen(false)}
 onSuccess={() => console.log('CreateServiceRequestModal success!')}
 />
 </div>
 )
}
