const ar_readings = {
  pageTitle: 'إدارة القراءات',
  pageSubtitle: 'إدارة قراءات العدادات ومتابعة الاستهلاك والتكاليف',
  breadcrumb: {
    home: 'الرئيسية',
    readings: 'القراءات',
  },
  stats: {
    totalReadings: 'إجمالي القراءات',
    approvedReadings: 'القراءات المعتمدة',
    pendingReadings: 'القراءات قيد المراجعة',
    rejectedReadings: 'القراءات المرفوضة',
    totalConsumption: 'إجمالي الاستهلاك',
    totalReadingCost: 'إجمالي تكلفة القراءات',
  },
  toolbar: {
    searchPlaceholder: 'البحث برقم العداد أو اسم العميل...',
    filters: {
      status: {
        all: 'كل الحالات',
        pending: 'قيد المراجعة',
        approved: 'معتمدة',
        rejected: 'مرفوضة',
      },
      month: {
        all: 'كل الأشهر',
        thisMonth: 'هذا الشهر',
      },
    },
    actions: {
      addReading: 'إضافة قراءة',
      refresh: 'تحديث',
    },
  },
  table: {
    columns: {
      readingId: 'رقم القراءة',
      meterNumber: 'رقم العداد',
      customer: 'العميل',
      previousReading: 'القراءة السابقة',
      currentReading: 'القراءة الحالية',
      consumption: 'الاستهلاك',
      pricePerKwh: 'سعر الكيلوواط',
      readingCost: 'التكلفة',
      readingDate: 'تاريخ القراءة',
      method: 'طريقة القراءة',
      status: 'الحالة',
      actions: 'الإجراءات',
    },
    emptyState: {
      title: 'لا توجد قراءات',
      description: 'قم بتعديل فلاتر البحث أو إضافة قراءة جديدة.',
    },
  },
  status: {
    pending: 'قيد المراجعة',
    approved: 'معتمدة',
    rejected: 'مرفوضة',
    unspecified: 'غير محددة',
  },
  method: {
    manual: 'يدوية',
    qr_scan: 'مسح QR',
    unspecified: 'غير محددة',
  },
  details: {
    title: 'تفاصيل القراءة',
    customer: 'العميل',
    notes: 'الملاحظات',
    createdBy: 'منشئ القراءة',
    createdAt: 'وقت الإنشاء',
  },
  addModal: {
    title: 'إضافة قراءة جديدة',
    editTitle: 'تعديل القراءة',
    description: 'أدخل تفاصيل القراءة الجديدة. سيتم حساب الاستهلاك والتكلفة تلقائياً من الباك اند.',
    editDescription: 'يمكن تعديل آخر قراءة فقط لكل عداد، وبشرط عدم وجود فاتورة مرتبطة بها.',
    meterSelect: 'اختر العداد',
    actions: {
      cancel: 'إلغاء',
      add: 'إضافة القراءة',
      update: 'حفظ التعديل',
      saving: 'جاري الحفظ...',
    },
  },
  actions: {
    viewDetails: 'عرض التفاصيل',
    edit: 'تعديل القراءة',
    delete: 'حذف القراءة',
    approve: 'اعتماد',
    reject: 'رفض',
  },
  notifications: {
    added: 'تمت إضافة القراءة بنجاح.',
    updated: 'تم تحديث القراءة بنجاح.',
    deleted: 'تم حذف القراءة بنجاح.',
    statusUpdated: 'تم تحديث حالة القراءة بنجاح.',
  },
  loading: 'جاري التحميل...',
  deleteConfirm: 'هل أنت متأكد من حذف هذه القراءة؟',
  pagination: {
    showing: 'عرض {{count}} من {{total}} قراءة',
  },
  errors: {
    loadFailed: 'تعذر تحميل القراءات. تأكد من تشغيل الخادم الخلفي.',
    statsFailed: 'تعذر تحميل إحصائيات القراءات.',
    saveFailed: 'تعذر حفظ القراءة.',
    deleteFailed: 'تعذر حذف القراءة.',
    loadDetailsFailed: 'تعذر تحميل بيانات القراءة.',
    loadMetersFailed: 'تعذر تحميل قائمة العدادات.',
  },
}

export default ar_readings
