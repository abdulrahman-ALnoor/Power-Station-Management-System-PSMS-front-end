// Arabic — Common translations
const ar_common = {
  // App
  appName: 'نظام البرق',
  appNameFull: 'نظام إدارة محطات الطاقة - البرق',

  // Actions
  save: 'حفظ',
  cancel: 'إلغاء',
  delete: 'حذف',
  edit: 'تعديل',
  add: 'إضافة',
  search: 'بحث',
  filter: 'تصفية',
  export: 'تصدير',
  import: 'استيراد',
  view: 'عرض',
  close: 'إغلاق',
  confirm: 'تأكيد',
  back: 'رجوع',
  next: 'التالي',
  previous: 'السابق',
  submit: 'إرسال',
  reset: 'إعادة تعيين',
  refresh: 'تحديث',
  print: 'طباعة',
  download: 'تحميل',
  upload: 'رفع',

  // Status
  status: {
    active: 'نشط',
    inactive: 'غير نشط',
    suspended: 'موقوف',
    pending: 'قيد الانتظار',
    approved: 'موافق عليه',
    rejected: 'مرفوض',
    completed: 'مكتمل',
    cancelled: 'ملغى',
    damaged: 'تالف',
  },

  // Table
  table: {
    noData: 'لا توجد بيانات',
    loading: 'جار التحميل...',
    rowsPerPage: 'صفوف في الصفحة',
    of: 'من',
    page: 'صفحة',
    showing: 'عرض',
    to: 'إلى',
    results: 'نتيجة',
    actions: 'إجراءات',
  },

  // Messages
  messages: {
    confirmDelete: 'هل أنت متأكد من الحذف؟',
    deleteWarning: 'لا يمكن التراجع عن هذا الإجراء.',
    success: 'تمت العملية بنجاح',
    error: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
    saved: 'تم الحفظ بنجاح',
    deleted: 'تم الحذف بنجاح',
    updated: 'تم التحديث بنجاح',
    sessionExpired: 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مجدداً.',
  },

  // Form validation
  validation: {
    required: 'هذا الحقل مطلوب',
    email: 'البريد الإلكتروني غير صحيح',
    minLength: 'يجب أن يكون على الأقل {{min}} أحرف',
    maxLength: 'يجب ألا يتجاوز {{max}} أحرف',
    passwordMismatch: 'كلمات المرور غير متطابقة',
    invalidPhone: 'رقم الهاتف غير صحيح',
  },

  // Language
  language: {
    arabic: 'العربية',
    english: 'English',
    switchTo: 'تبديل اللغة',
  },

  // Pagination
  pagination: {
    first: 'الأول',
    last: 'الأخير',
    next: 'التالي',
    previous: 'السابق',
  },

  // Empty & Error states
  states: {
    emptyTitle: 'لا توجد بيانات',
    emptyDescription: 'لم يتم العثور على أي نتائج.',
    errorTitle: 'حدث خطأ',
    errorDescription: 'يرجى المحاولة مرة أخرى.',
    retry: 'إعادة المحاولة',
    loadingTitle: 'جار التحميل...',
  },
}

export default ar_common
