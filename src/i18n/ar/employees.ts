export default {
  pageTitle: 'إدارة الموظفين',
  breadcrumbs: {
    home: 'الرئيسية',
    employees: 'إدارة الموظفين',
  },
  stats: {
    total: {
      label: 'إجمالي الموظفين',
      subtext: 'القوة العاملة الإجمالية'
    },
    admins: {
      label: 'عدد المدراء',
      subtext: 'الإدارة والمشرفين'
    },
    engineers: {
      label: 'عدد المهندسين',
      subtext: 'الفرق الفنية والميدانية'
    },
    readers: {
      label: 'قراء العدادات',
      subtext: 'التغطية الجغرافية 94%'
    },
    accountants: {
      label: 'عدد المحاسبين',
      subtext: 'قسم التحصيل والمالية'
    },
    active: 'نشط',
    stable: 'ثابت'
  },
  toolbar: {
    searchPlaceholder: 'البحث برقم الموظف، الاسم، أو الهاتف...',
    jobTitle: 'المسمى الوظيفي',
    roles: {
      manager: 'مدير',
      engineer: 'مهندس',
      reader: 'قارئ',
      accountant: 'محاسب'
    },
    status: 'الحالة',
    refresh: 'تحديث',
    addEmployee: 'إضافة موظف'
  },
  table: {
    employee: 'الموظف',
    contactInfo: 'بيانات الاتصال',
    role: 'الدور والوظيفة',
    status: 'الحالة',
    actions: 'الإجراءات'
  },
  status: {
    active: 'نشط',
    inactive: 'غير نشط'
  },
  actions: {
    view: 'عرض',
    edit: 'تعديل',
    delete: 'حذف'
  },
  pagination: {
    showing: 'عرض {{count}} من أصل {{total}} موظف'
  },
  permissions: {
    sectionTitle: 'نظرة عامة على الصلاحيات',
    admin: {
      title: 'مدير النظام',
      fullControl: 'تحكم كامل في الموظفين',
      financialSettings: 'إدارة الإعدادات المالية',
      reportsAccess: 'الوصول لكافة التقارير',
      generalConfig: 'ضبط التكوين العام'
    },
    engineer: {
      title: 'مهندس',
      maintenanceRequests: 'إدارة طلبات الصيانة',
      networkStatus: 'تحديث حالة الشبكة',
      technicalMaps: 'عرض الخرائط التقنية',
      noFinancialAccess: 'لا صلاحية مالية'
    },
    reader: {
      title: 'قارئ عدادات',
      dailyReadings: 'تسجيل القراءات اليومية',
      uploadPhotos: 'رفع صور العدادات',
      reportIssues: 'تحديد المشاكل الفنية',
      limitedAccess: 'وصول محدود للنظام'
    },
    accountant: {
      title: 'محاسب',
      invoices: 'إدارة الفواتير والتحصيل',
      settlements: 'مراجعة التسويات المالية',
      statements: 'استخراج كشوفات الحساب',
      noTechnicalAccess: 'لا صلاحية فنية'
    },
    closeOpenStations: 'إغلاق وفتح المحطات',
    changeHighVoltageBreakers: 'تغيير قواطع الضغط العالي',
    issueFaultReports: 'إصدار تقارير الأعطال'
  },
  drawer: {
    personalInfo: 'المعلومات الشخصية',
    employeeId: 'رقم الموظف',
    nationalId: 'رقم الهوية',
    hireDate: 'تاريخ التعيين',
    region: 'المنطقة',
    permissions: 'الصلاحيات والمهمات',
    active: 'مفعل',
    inactive: 'غير مفعل',
    equipment: 'المعدات العهدة',
    equip: {
      engineerLaptop: 'لاب توب مهندس',
      mobilePhone: 'هاتف جوال',
      fieldCar: 'سيارة ميدان'
    },
    editData: 'تعديل البيانات',
    suspendAccount: 'إيقاف الحساب'
  },
  modal: {
    addTitle: 'إضافة موظف جديد',
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    password: 'كلمة المرور',
    passwordConfirmation: 'تأكيد كلمة المرور',
    role: 'الدور (الصلاحيات)',
    status: 'الحالة',
    cancel: 'إلغاء',
    save: 'حفظ الموظف'
  },
  common: {
    close: 'إغلاق'
  }
}
