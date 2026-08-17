import { Employee, EmployeeStat, PermissionGroup } from '../types'

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '1',
    name: 'أحمد منصور',
    email: 'ahmed.m@albarq.sa',
    phone: '+966 50 123 4567',
    status: 'active',
    roles: ['engineer'],
    permissions: [
      { id: 'p1', nameKey: 'closeOpenStations', active: true },
      { id: 'p2', nameKey: 'changeHighVoltageBreakers', active: true },
      { id: 'p3', nameKey: 'issueFaultReports', active: true },
    ],
    equipment: [
      { id: 'e1', type: 'laptop', nameKey: 'engineerLaptop' },
      { id: 'e2', type: 'smartphone', nameKey: 'mobilePhone' },
      { id: 'e3', type: 'car_repair', nameKey: 'fieldCar' },
    ]
  },
  {
    id: '2',
    name: 'سارة الشمري',
    email: 'sara.s@albarq.sa',
    phone: '+966 50 234 5678',
    status: 'inactive',
    roles: ['accountant'],
  },
  {
    id: '3',
    name: 'محمد فهد',
    email: 'm.fahad@albarq.sa',
    phone: '+966 50 345 6789',
    status: 'inactive',
    roles: ['reader'],
  }
]

export const MOCK_STATS: EmployeeStat[] = [
  {
    id: 's1',
    labelKey: 'stats.total.label',
    value: 482,
    subtextKey: 'stats.total.subtext',
    icon: 'groups',
    variant: 'primary',
    trend: { value: '+12%', type: 'up' }
  },
  {
    id: 's2',
    labelKey: 'stats.admins.label',
    value: 14,
    subtextKey: 'stats.admins.subtext',
    icon: 'admin_panel_settings',
    variant: 'steel-blue',
    trend: { value: '', type: 'neutral', labelKey: 'stats.stable' }
  },
  {
    id: 's3',
    labelKey: 'stats.engineers.label',
    value: 128,
    subtextKey: 'stats.engineers.subtext',
    icon: 'construction',
    variant: 'bright-gold',
    trend: { value: '+3', type: 'up' }
  },
  {
    id: 's4',
    labelKey: 'stats.readers.label',
    value: 215,
    subtextKey: 'stats.readers.subtext',
    icon: 'pin_drop',
    variant: 'secondary-container',
    trend: { value: '-5', type: 'down' }
  },
  {
    id: 's5',
    labelKey: 'stats.accountants.label',
    value: 42,
    subtextKey: 'stats.accountants.subtext',
    icon: 'account_balance',
    variant: 'primary-container',
    trend: { value: '', type: 'neutral', labelKey: 'stats.active' }
  }
]

export const MOCK_PERMISSIONS: PermissionGroup[] = [
  {
    id: 'pg1',
    titleKey: 'permissions.admin.title',
    icon: 'verified_user',
    items: [
      { id: 'pi1', textKey: 'permissions.admin.fullControl', granted: true },
      { id: 'pi2', textKey: 'permissions.admin.financialSettings', granted: true },
      { id: 'pi3', textKey: 'permissions.admin.reportsAccess', granted: true },
      { id: 'pi4', textKey: 'permissions.admin.generalConfig', granted: true }
    ]
  },
  {
    id: 'pg2',
    titleKey: 'permissions.engineer.title',
    icon: 'token',
    items: [
      { id: 'pi5', textKey: 'permissions.engineer.maintenanceRequests', granted: true },
      { id: 'pi6', textKey: 'permissions.engineer.networkStatus', granted: true },
      { id: 'pi7', textKey: 'permissions.engineer.technicalMaps', granted: true },
      { id: 'pi8', textKey: 'permissions.engineer.noFinancialAccess', granted: false }
    ]
  },
  {
    id: 'pg3',
    titleKey: 'permissions.reader.title',
    icon: 'edit_square',
    items: [
      { id: 'pi9', textKey: 'permissions.reader.dailyReadings', granted: true },
      { id: 'pi10', textKey: 'permissions.reader.uploadPhotos', granted: true },
      { id: 'pi11', textKey: 'permissions.reader.reportIssues', granted: true },
      { id: 'pi12', textKey: 'permissions.reader.limitedAccess', granted: false }
    ]
  },
  {
    id: 'pg4',
    titleKey: 'permissions.accountant.title',
    icon: 'account_balance_wallet',
    items: [
      { id: 'pi13', textKey: 'permissions.accountant.invoices', granted: true },
      { id: 'pi14', textKey: 'permissions.accountant.settlements', granted: true },
      { id: 'pi15', textKey: 'permissions.accountant.statements', granted: true },
      { id: 'pi16', textKey: 'permissions.accountant.noTechnicalAccess', granted: false }
    ]
  }
]
