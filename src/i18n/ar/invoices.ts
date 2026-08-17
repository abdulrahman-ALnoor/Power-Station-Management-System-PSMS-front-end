const ar_invoices = {
  pageTitle: 'إدارة الفواتير والتحصيلات المالية',
  pageSubtitle: 'متابعة الفواتير، التحصيلات، والمدفوعات المالية',
  breadcrumb: {
    home: 'الرئيسية',
    invoices: 'الفواتير والتحصيلات المالية'
  },
  stats: {
    totalInvoices: 'إجمالي الفواتير',
    paidInvoices: 'الفواتير المدفوعة',
    partiallyPaidInvoices: 'الفواتير المدفوعة جزئيًا',
    totalInvoicedAmount: 'إجمالي قيمة الفواتير',
    totalCollections: 'إجمالي التحصيل',
    totalOutstanding: 'إجمالي المستحقات'
  },
  toolbar: {
    searchPlaceholder: 'البحث برقم الفاتورة أو اسم العميل...',
    status: 'كل الحالات',
    createInvoice: 'إنشاء فاتورة',
    export: 'تصدير البيانات',
    refresh: 'تحديث'
  },
  table: {
    invoiceNumber: 'رقم الفاتورة',
    customerName: 'اسم العميل',
    meterNumber: 'رقم العداد',
    amount: 'المبلغ',
    paidAmount: 'المدفوع',
    remainingAmount: 'المتبقي',
    createdAt: 'تاريخ الإصدار',
    status: 'الحالة',
    actions: 'الإجراءات',
    view: 'عرض',
    edit: 'تعديل',
    delete: 'حذف',
    unassigned: 'غير محدد'
  },
  status: {
    paid: 'مدفوعة',
    partially_paid: 'مدفوعة جزئيًا',
    unspecified: 'غير محددة'
  },
  charts: {
    monthlyComparison: 'مقارنة الفواتير والتحصيلات',
    statusDistribution: 'توزيع حالة الفواتير',
    invoices: 'الفواتير',
    collections: 'التحصيلات'
  },
  drawer: {
    title: 'تفاصيل الفاتورة',
    close: 'إغلاق',
    invoiceNumber: 'رقم الفاتورة',
    customerName: 'اسم العميل',
    outstandingBeforePayment: 'المبلغ قبل الدفع',
    paidAmount: 'المبلغ المدفوع',
    remainingBalance: 'المتبقي',
    status: 'الحالة',
    accountant: 'المحاسب',
    paymentNotes: 'ملاحظات الدفع',
    createdAt: 'تاريخ الإنشاء',
    updatedAt: 'آخر تحديث',
    noNotes: 'لا توجد ملاحظات',
    editData: 'تعديل البيانات'
  },
  shortcuts: {
    revenueReport: 'تقرير الإيرادات',
    revenueReportDesc: 'الاطلاع على تقرير الإيرادات المفصل',
    overdueInvoices: 'الفواتير المتأخرة',
    overdueInvoicesDesc: 'متابعة وتحصيل الفواتير المتأخرة السداد',
    collections: 'التحصيلات',
    collectionsDesc: 'إدارة وتتبع عمليات التحصيل اليومية',
    accountStatement: 'كشف الحساب',
    accountStatementDesc: 'استخراج كشوفات حساب تفصيلية للعملاء',
    viewReport: 'عرض التقرير'
  },
  pagination: {
    showing: 'عرض 1-{{count}} من أصل {{total}} فاتورة'
  },
  addModal: {
    title: 'إنشاء فاتورة',
    description: 'أدخل تفاصيل الفاتورة الجديدة أدناه.',
    fields: {
      customer: 'العميل',
      meter: 'العداد',
      outstandingBeforePayment: 'المبلغ المستحق',
      paidAmount: 'المبلغ المدفوع',
      paymentNotes: 'ملاحظات الدفع'
    },
    actions: {
      cancel: 'إلغاء',
      add: 'إنشاء الفاتورة'
    }
  }
}

export default ar_invoices
