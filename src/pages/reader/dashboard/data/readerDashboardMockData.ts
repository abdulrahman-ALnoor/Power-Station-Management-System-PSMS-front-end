import { ReaderDashboardResponse } from '../types/readerDashboard.types'

export const readerDashboardMockData: ReaderDashboardResponse = {
 stats: {
 totalReadings: 1248,
 todayReadings: 42,
 overdueReadings: 8,
 serviceRequests: 12,
 },
 progress: {
 completed: 35,
 total: 42,
 percentage: 83, // Approximately 35/42
 },
 latestReadings: [
 {
 id: 'r1',
 meterNumber: 'MTR-9021',
 customerName: 'محمد عبدالله',
 previousReading: 12450,
 currentReading: 12890,
 consumption: '440 kWh',
 date: '24/05/2026',
 status: 'completed',
 },
 {
 id: 'r2',
 meterNumber: 'MTR-8843',
 customerName: 'أحمد سالم',
 previousReading: 128441,
 currentReading: 129681,
 consumption: '1,240 kWh',
 date: '24/05/2026',
 status: 'review',
 },
 {
 id: 'r3',
 meterNumber: 'MTR-7112',
 customerName: 'سارة خالد',
 previousReading: 5020,
 currentReading: 5120,
 consumption: '100 kWh',
 date: '23/05/2026',
 status: 'completed',
 },
 {
 id: 'r4',
 meterNumber: 'MTR-6432',
 customerName: 'شركة النور',
 previousReading: 45000,
 currentReading: 48000,
 consumption: '3,000 kWh',
 date: '23/05/2026',
 status: 'late',
 }
 ],
 notifications: [
 {
 id: 'n1',
 title: 'قراءة متأخرة',
 description: 'يوجد عداد لم تتم قراءته اليوم.',
 type: 'late',
 date: 'منذ 10 دقائق',
 },
 {
 id: 'n2',
 title: 'تحديث مطلوب',
 description: 'يوجد عداد يحتاج إلى مراجعة القراءة.',
 type: 'update',
 date: 'منذ ساعة',
 },
 {
 id: 'n3',
 title: 'طلب خدمة جديد',
 description: 'تم إنشاء طلب خدمة مرتبط بأحد العدادات.',
 type: 'service',
 date: 'منذ ساعتين',
 },
 ],
 consumptionChart: [
 { day: 'السبت', consumption: 4200 },
 { day: 'الأحد', consumption: 4500 },
 { day: 'الإثنين', consumption: 4800 },
 { day: 'الثلاثاء', consumption: 4100 },
 { day: 'الأربعاء', consumption: 4900 },
 { day: 'الخميس', consumption: 5100 },
 { day: 'الجمعة', consumption: 3800 },
 ]
}
