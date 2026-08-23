export const serviceRequests = {
 addModal: {
 title: 'طلب خدمة',
 description: 'أدخل تفاصيل طلب الخدمة أدناه.',
 fields: {
 meter: 'العداد',
 customer: 'العميل',
 assignedEngineer: 'المهندس المسؤول',
 requestType: 'نوع الطلب',
 priority: 'الأولوية',
 status: 'الحالة',
 description: 'الوصف',
 completedAt: 'تاريخ الإكمال'
 },
 requestTypes: {
 new_connection: 'توصيل جديد',
 maintenance: 'صيانة',
 disconnection: 'فصل'
 },
 priorities: {
 low: 'منخفضة',
 medium: 'متوسطة',
 high: 'عالية',
 emergency: 'طارئة'
 },
 statuses: {
 pending: 'قيد الانتظار',
 assigned: 'تم التعيين',
 in_progress: 'قيد التنفيذ',
 completed: 'مكتمل',
 cancelled: 'ملغي'
 },
 actions: {
 cancel: 'إلغاء',
 add: 'إضافة الطلب'
 }
 }
}
