import React, { useState, useEffect } from 'react'
import {
 TrendingUp,
 TrendingDown,
 DollarSign,
 Users,
 Activity,
 AlertCircle
} from 'lucide-react'
import {
 dashboardService,
 AccountantDashboardStats
} from '../../../services/accountant/dashboardService'
import type { Invoice } from '@/pages/accountant/invoices/types'
import { MonthlyRevenueChart } from './components/MonthlyRevenueChart'
import { LatestCollectionsTable } from './components/LatestCollectionsTable'
import { AccountantStatsCards } from './components/AccountantStatsCards'

class DashboardErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
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
 <h2 className="text-xl font-bold mb-2 text-text">تعذر تحميل لوحة القيادة</h2>
 <button 
 onClick={() => window.location.reload()}
 className="px-4 py-2 bg-primary text-on-primary rounded-lg mt-4"
 >
 إعادة المحاولة
 </button>
 </div>
 )
 }
 return this.props.children
 }
}

export function AccountantDashboardPage() {
 return (
 <DashboardErrorBoundary>
 <DashboardContent />
 </DashboardErrorBoundary>
 )
}

function DashboardContent() {
 const [stats, setStats] = useState<AccountantDashboardStats | null>(null)
 const [revenueData, setRevenueData] = useState<{ month: string; month_label: string; days: { day: number; revenue: number }[] } | null>(null)
 const [collections, setCollections] = useState<Invoice[]>([])
 const [loading, setLoading] = useState(true)
 const [revenueError, setRevenueError] = useState<string | null>(null)

 useEffect(() => {
 let mounted = true
 const fetchData = async () => {
 setLoading(true)
 try {
 const [statsData, latestCollections] = await Promise.all([
 dashboardService.getDashboardStats(),
 dashboardService.getLatestCollections()
 ])
 
 let revenue = null
 let rError = null
 try {
 revenue = await dashboardService.getMonthlyRevenue()
 } catch (e) {
 rError = 'error'
 }

 if (mounted) {
 setStats(statsData)
 setRevenueData(revenue)
 setRevenueError(rError)
 setCollections(latestCollections)
 setLoading(false)
 }
 } catch (err) {
 if (mounted) {
 setLoading(false)
 throw err 
 }
 }
 }
 fetchData()
 return () => { mounted = false }
 }, [])

 if (loading || !stats) {
 return (
 <div className="space-y-6 animate-pulse p-6">
 <div className="h-8 w-48 bg-surface-container rounded mb-8"></div>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 {[1, 2, 3, 4, 5, 6].map((i) => (
 <div key={i} className="h-24 bg-surface-container rounded-xl"></div>
 ))}
 </div>
 <div className="h-96 bg-surface-container rounded-xl mt-8"></div>
 </div>
 )
 }

 const formatCurrency = (value: number) => {
 return new Intl.NumberFormat('ar-SA', {
 style: 'currency',
 currency: 'SAR',
 maximumFractionDigits: 0,
 }).format(value).replace('SAR', 'ر.س')
 }

 return (
 <div className="space-y-6 max-w-[1440px] mx-auto pb-12 animate-fade-in" dir="rtl">
 
 <div className="flex justify-between items-center">
 <div>
 <h1 className="text-2xl font-bold text-text mb-1">لوحة تحكم المحاسب</h1>
 <p className="text-sm text-text-muted">ملخص الأداء المالي والتحصيلات</p>
 </div>
 </div>

 {/* Overview Cards */}
 <AccountantStatsCards stats={stats} />

 {/* Monthly Revenue Chart */}
 <div className="w-full">
 <MonthlyRevenueChart 
 data={revenueData} 
 isLoading={loading} 
 error={revenueError}
 />
 </div>

 {/* Latest Collections Table */}
 <div className="w-full">
 <LatestCollectionsTable data={collections} isLoading={loading} />
 </div>
 </div>
 )
}
