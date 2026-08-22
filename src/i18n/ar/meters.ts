export default {
  title: 'إدارة العدادات',
  breadcrumb: {
    home: 'الرئيسية',
    meters: 'إدارة العدادات'
  },
  stats: {
    total: {
      label: 'إجمالي العدادات',
      subtext: 'كل العدادات المسجلة'
    },
    active: {
      label: 'عدادات نشطة',
      subtext: 'تعمل حالياً'
    },
    disconnected: {
      label: 'عدادات مفصولة',
      subtext: 'تم فصل الخدمة'
    },
    maintenance: {
      label: 'عدادات تحت الصيانة',
      subtext: 'صيانة دورية أو طارئة'
    },
    damaged: {
      label: 'عدادات تالفة',
      subtext: 'بحاجة للاستبدال'
    }
  },
  toolbar: {
    searchPlaceholder: 'البحث برقم العداد...',
    status: 'الحالة',
    refresh: 'تحديث',
    addMeter: 'إضافة عداد'
  },
  table: {
    id: '#',
    meterNumber: 'رقم العداد',
    customer: 'العميل',
    qrCode: 'رمز QR',
    installationDate: 'تاريخ التركيب',
    installationLocation: 'موقع التركيب',
    status: 'الحالة',
    installedBy: 'تم التركيب بواسطة',
    createdBy: 'أُنشئ بواسطة',
    createdAt: 'تاريخ الإنشاء',
    actions: 'إجراءات',
    view: 'عرض',
    edit: 'تعديل',
    delete: 'حذف'
  },
  status: {
    active: 'نشط',
    disconnected: 'مفصول',
    maintenance: 'قيد الصيانة',
    damaged: 'تالف'
  },
  emptyState: {
    title: 'لا توجد عدادات مسجلة حتى الآن',
    description: 'يرجى إضافة عدادات جديدة أو تعديل فلاتر البحث لإظهار النتائج المطلوبة في هذا الجدول.'
  },
  loading: 'جاري التحميل...',
  errors: {
    loadFailed: 'تعذر تحميل العدادات. تأكد من تشغيل الخادم الخلفي.',
    statsFailed: 'تعذر تحميل إحصائيات العدادات.',
    deleteFailed: 'تعذر حذف العداد.',
    saveFailed: 'تعذر حفظ العداد.',
    loadDetailsFailed: 'تعذر تحميل بيانات العداد.'
  },
  deleteConfirm: 'هل أنت متأكد من حذف هذا العداد؟',
  pagination: {
    showing: 'عرض {{count}} من {{total}} عداد'
  },
  modal: {
    addTitle: 'إضافة عداد جديد',
    editTitle: 'تعديل بيانات العداد',
    subtitle: 'أدخل بيانات العداد ومعلومات تركيبه.',
    sectionMeter: 'بيانات العداد',
    sectionInstallation: 'معلومات التركيب',
    sectionStatus: 'الحالة',
    meterNumber: 'رقم العداد',
    qrCode: 'رمز QR',
    searchCustomer: 'العميل',
    selectCustomerPlaceholder: 'اختر عميلاً...',
    installationDate: 'تاريخ التركيب',
    installationLocation: 'موقع التركيب',
    installedBy: 'تم التركيب بواسطة',
    selectInstalledByPlaceholder: 'اختر الفني المسؤول...',
    status: 'حالة العداد',
    cancel: 'إلغاء',
    confirmAdd: 'حفظ العداد',
    confirmEdit: 'تحديث العداد',
    saving: 'جاري الحفظ...'
  },
  drawer: {
    title: 'تفاصيل العداد',
    close: 'إغلاق',
    smartMeter: 'رقم العداد الذكي',
    customerInfo: 'بيانات العميل',
    fullName: 'الاسم بالكامل',
    subscriptionNo: 'رقم الاشتراك',
    address: 'العنوان',
    analytics: 'تحليل الاستهلاك (آخر 6 أشهر)',
    noData: 'لا توجد بيانات',
    recentRequests: 'طلبات الخدمة الأخيرة',
    noRequests: 'لا توجد طلبات',
    printReport: 'طباعة التقرير',
    viewInvoices: 'عرض الفواتير',
    createdAt: 'تاريخ الإنشاء',
    qrImage: 'صورة رمز QR'
  },
  months: {
    1: 'يناير',
    2: 'فبراير',
    3: 'مارس',
    4: 'أبريل',
    5: 'مايو',
    6: 'يونيو'
  },
  requests: {
    periodicInspection: 'فحص دوري للعداد',
    replacePanel: 'تبديل لوحة التحكم',
    maintenance: 'صيانة دورية',
    connectionLoss: 'فقدان الاتصال بالشبكة'
  }
}