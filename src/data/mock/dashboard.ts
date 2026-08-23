// ============================================================
// Dashboard Mock Data
// Provides typed mock data for the Admin Dashboard components
// Matches the Google Stitch design specifications
// ============================================================

import type { StatusVariant } from '@/types/common'

// 1. Dashboard Statistics
export interface StatItem {
 id: string
 titleKey: string
 value: string | number
 icon: string
 iconColor: string
 iconBg: string
 trend?: {
 direction: 'up' | 'down' | 'neutral'
 value: string
 }
}

export const getMockStats = (): StatItem[] => [
 {
 id: 'customers',
 titleKey: 'stats.totalCustomers',
 value: '12,845',
 icon: 'group',
 iconColor: 'var(--color-primary)',
 iconBg: 'rgba(0,24,61,0.05)',
 trend: { direction: 'up', value: '12%' },
 },
 {
 id: 'meters',
 titleKey: 'stats.totalMeters',
 value: '13,201',
 icon: 'electric_meter',
 iconColor: 'var(--color-steel-blue)',
 iconBg: 'rgba(79,121,183,0.1)',
 trend: { direction: 'up', value: '8%' },
 },
 {
 id: 'employees',
 titleKey: 'stats.totalEmployees',
 value: '158',
 icon: 'badge',
 iconColor: 'var(--color-amber-gold, #E08A00)',
 iconBg: 'rgba(224,138,0,0.1)',
 trend: { direction: 'neutral', value: '0%' },
 },
 {
 id: 'todayReadings',
 titleKey: 'stats.todayReadings',
 value: '1,420',
 icon: 'visibility',
 iconColor: 'var(--color-amber-gold, #E08A00)',
 iconBg: 'rgba(253,187,18,0.1)',
 trend: { direction: 'up', value: '4.5%' },
 },
 {
 id: 'serviceRequests',
 titleKey: 'stats.serviceRequests',
 value: '243',
 icon: 'support_agent',
 iconColor: 'var(--color-primary)',
 iconBg: 'rgba(0,24,61,0.05)',
 trend: { direction: 'down', value: '15%' }, // In design this was a red trending up (negative meaning), but we'll use down with red or just up with red. We'll map colors inside the component.
 },
 {
 id: 'unpaidInvoices',
 titleKey: 'stats.unpaidInvoices',
 value: '312',
 icon: 'money_off',
 iconColor: 'var(--color-danger)',
 iconBg: 'rgba(186,26,26,0.1)',
 trend: { direction: 'down', value: '2%' },
 },
 {
 id: 'monthlyRevenue',
 titleKey: 'stats.monthlyRevenue',
 value: '450k',
 icon: 'payments',
 iconColor: 'var(--color-success)',
 iconBg: 'var(--color-success-light)',
 trend: { direction: 'up', value: '18%' },
 },
 {
 id: 'equipment',
 titleKey: 'stats.equipment',
 value: '84',
 icon: 'construction',
 iconColor: 'var(--color-steel-blue)',
 iconBg: 'rgba(79,121,183,0.1)',
 trend: { direction: 'neutral', value: '0%' },
 },
]

// 2. Monthly Revenue Data
export interface MonthlyRevenueData {
 nameKey: string
 revenue: number
}

export const getMockMonthlyRevenue = (): MonthlyRevenueData[] => [
 { nameKey: 'months.jan', revenue: 40 },
 { nameKey: 'months.feb', revenue: 55 },
 { nameKey: 'months.mar', revenue: 45 },
 { nameKey: 'months.apr', revenue: 70 },
 { nameKey: 'months.may', revenue: 85 },
 { nameKey: 'months.jun', revenue: 60 },
 { nameKey: 'months.jul', revenue: 75 },
 { nameKey: 'months.aug', revenue: 90 },
 { nameKey: 'months.sep', revenue: 65 },
 { nameKey: 'months.oct', revenue: 80 },
 { nameKey: 'months.nov', revenue: 95 },
 { nameKey: 'months.dec', revenue: 100 },
]

// 3. Equipment Status
export interface EquipmentStatusData {
 total: number
 inUse: { count: number; percentage: number }
 needsMaintenance: { count: number; percentage: number }
 available: { count: number; percentage: number }
}

export const getMockEquipmentStatus = (): EquipmentStatusData => ({
 total: 84,
 inUse: { count: 62, percentage: 74 },
 needsMaintenance: { count: 12, percentage: 14 },
 available: { count: 10, percentage: 12 },
})

// 4. Latest Service Requests
export interface ServiceRequest {
 id: string
 customer: string
 typeKey: string
 priorityKey: string
 priorityVariant: StatusVariant
 statusKey: string
 statusVariant: StatusVariant
 date: string
}

export const getMockServiceRequests = (): ServiceRequest[] => [
 {
 id: '#REQ-892',
 customer: 'محمد العتيبي',
 typeKey: 'requestTypes.changeMeter',
 priorityKey: 'priorities.high',
 priorityVariant: 'danger',
 statusKey: 'statuses.inProgress',
 statusVariant: 'warning',
 date: '12-05-2024',
 },
 {
 id: '#REQ-891',
 customer: 'سارة خالد',
 typeKey: 'requestTypes.invoiceComplaint',
 priorityKey: 'priorities.normal',
 priorityVariant: 'neutral',
 statusKey: 'statuses.completed',
 statusVariant: 'success',
 date: '12-05-2024',
 },
 {
 id: '#REQ-890',
 customer: 'فيصل الحربي',
 typeKey: 'requestTypes.suddenFailure',
 priorityKey: 'priorities.urgent',
 priorityVariant: 'danger',
 statusKey: 'statuses.waitingForTech',
 statusVariant: 'danger',
 date: '11-05-2024',
 },
]

// 5. Latest Readings
export interface MeterReading {
 meterId: string
 customer: string
 reading: string
 consumption: string
 isPositive: boolean
 reader: string
 dateKey: string
}

export const getMockLatestReadings = (): MeterReading[] => [
 {
 meterId: '998273',
 customer: 'عبدالله سالم',
 reading: '12,450',
 consumption: '+240',
 isPositive: true,
 reader: 'إبراهيم م.',
 dateKey: 'timeAgo.oneHour',
 },
 {
 meterId: '445612',
 customer: 'مؤسسة النهضة',
 reading: '45,120',
 consumption: '+1,200',
 isPositive: false, // In design, this is red (error)
 reader: 'نظام آلي',
 dateKey: 'timeAgo.twoHours',
 },
 {
 meterId: '112009',
 customer: 'ليلى ناصر',
 reading: '8,900',
 consumption: '+150',
 isPositive: true,
 reader: 'إبراهيم م.',
 dateKey: 'timeAgo.threeHours',
 },
]

// 6. Recent Collections
export interface CollectionData {
 id: string
 customerInfoKey: string // Translation key that might need interpolation
 amount: string
 date: string
 method: 'pos' | 'bank_transfer' | 'cash'
}

export const getMockCollections = (): CollectionData[] => [
 {
 id: 'INV-2291',
 customerInfoKey: 'collections.customerPos', // "العميل: ماجد العنزي | محصل: نقطة بيع"
 amount: '450.00 ر.س',
 date: '12-05-2024',
 method: 'pos',
 },
 {
 id: 'INV-2285',
 customerInfoKey: 'collections.customerBank', // "العميل: شركة الواحة | محصل: تحويل بنكي"
 amount: '12,500.00 ر.س',
 date: '11-05-2024',
 method: 'bank_transfer',
 },
 {
 id: 'INV-2280',
 customerInfoKey: 'collections.customerCash', // "العميل: منيرة صقر | محصل: نقدي"
 amount: '320.50 ر.س',
 date: '11-05-2024',
 method: 'cash',
 },
]

// 7. System Notifications
export interface NotificationData {
 id: string
 titleKey: string
 descriptionKey: string
 timeKey: string
 variant: 'danger' | 'warning'
}

export const getMockNotifications = (): NotificationData[] => [
 {
 id: '1',
 titleKey: 'notifications.transformerFailure',
 descriptionKey: 'notifications.transformerFailureDesc',
 timeKey: 'timeAgo.tenMins',
 variant: 'danger',
 },
 {
 id: '2',
 titleKey: 'notifications.systemUpdate',
 descriptionKey: 'notifications.systemUpdateDesc',
 timeKey: 'timeAgo.oneHour',
 variant: 'warning',
 },
]

// 8. Recent Activities
export interface ActivityData {
 id: string
 titleKey: string
 descriptionKey: string
 color: string
}

export const getMockActivities = (): ActivityData[] => [
 {
 id: '1',
 titleKey: 'activities.newCustomer',
 descriptionKey: 'activities.newCustomerDesc',
 color: 'var(--color-bright-gold, #FFC72C)',
 },
 {
 id: '2',
 titleKey: 'activities.weeklyReport',
 descriptionKey: 'activities.weeklyReportDesc',
 color: 'var(--color-steel-blue, #4F79B7)',
 },
 {
 id: '3',
 titleKey: 'activities.login',
 descriptionKey: 'activities.loginDesc',
 color: 'var(--color-primary, #00183d)',
 },
]
