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
    searchPlaceholder: 'البحث في القراءات...',
    filters: {
      status: {
        all: 'كل الحالات',
        pending: 'قيد المراجعة',
        approved: 'معتمدة',
        rejected: 'مرفوضة',
      },
      method: {
        all: 'كل طرق القراءة',
        manual: 'يدوية',
        qrScan: 'مسح QR',
      },
      date: {
        all: 'كل التواريخ',
        today: 'اليوم',
        thisWeek: 'هذا الأسبوع',
        thisMonth: 'هذا الشهر',
      },
    },
    actions: {
      addReading: 'إضافة قراءة',
      export: 'تصدير',
      refresh: 'تحديث',
    },
  },
  table: {
    columns: {
      readingId: 'رقم القراءة',
      meterNumber: 'رقم العداد',
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
    notes: 'الملاحظات',
    createdBy: 'منشئ القراءة',
    createdAt: 'وقت الإنشاء',
    updatedAt: 'آخر تحديث',
  },
  addModal: {
    title: 'إضافة قراءة جديدة',
    description: 'أدخل تفاصيل القراءة الجديدة. سيتم حساب الاستهلاك والتكلفة تلقائياً.',
    meterSelect: 'اختر العداد',
    preview: {
      consumption: 'الاستهلاك المقدر',
      cost: 'التكلفة المقدرة',
    },
    actions: {
      cancel: 'إلغاء',
      add: 'إضافة القراءة',
    },
    validation: {
      currentLessThanPrevious: 'لا يمكن أن تكون القراءة الحالية أقل من القراءة السابقة.',
    }
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
    deleted: 'تم حذف القراءة بنجاح.',
    statusUpdated: 'تم تحديث حالة القراءة بنجاح.',
  }
}

export default ar_readings
