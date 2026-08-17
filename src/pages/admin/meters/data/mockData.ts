import { Meter, MeterStat } from '../types'

export const MOCK_METERS: Meter[] = [
  {
    id: 1,
    customer_id: 1,
    customerName: 'شركة التقنية الحديثة',
    meter_number: 'MT-849201',
    qr_code: 'QR-MT-849201',
    installation_date: '2023-05-12',
    installation_location: 'المبنى الرئيسي - الطابق الأرضي',
    status: 'active',
    installed_by: 101,
    installedByName: 'Ahmed Ali',
    created_by: 1
  },
  {
    id: 2,
    customer_id: 2,
    customerName: 'مستشفى الحياة',
    meter_number: 'MT-758392',
    qr_code: 'QR-MT-758392',
    installation_date: '2022-11-04',
    installation_location: 'غرفة الكهرباء الرئيسية - مبنى ب',
    status: 'maintenance',
    installed_by: 102,
    installedByName: 'Mohammed Khaled',
    created_by: 1
  },
  {
    id: 3,
    customer_id: 3,
    customerName: 'مجمع الرياض السكني',
    meter_number: 'MT-647283',
    qr_code: 'QR-MT-647283',
    installation_date: '2024-01-20',
    installation_location: 'المدخل الشمالي',
    status: 'disconnected',
    installed_by: 101,
    installedByName: 'Ahmed Ali',
    created_by: 1
  },
  {
    id: 4,
    customer_id: 4,
    customerName: 'مصنع الأمل للبلاستيك',
    meter_number: 'MT-536172',
    qr_code: 'QR-MT-536172',
    installation_date: '2021-08-15',
    installation_location: 'العنبر رقم 3 - الخط الإنتاجي',
    status: 'damaged',
    installed_by: 103,
    installedByName: 'Sara Ahmed',
    created_by: 1
  }
]

export const MOCK_STATS: MeterStat[] = [
  {
    id: 's1',
    labelKey: 'stats.total.label',
    value: '12,450',
    subtextKey: 'stats.total.subtext',
    icon: 'inventory_2',
    variant: 'primary'
  },
  {
    id: 's2',
    labelKey: 'stats.active.label',
    value: '11,200',
    subtextKey: 'stats.active.subtext',
    icon: 'check_circle',
    variant: 'green',
    trend: { value: '2%', type: 'up' }
  },
  {
    id: 's3',
    labelKey: 'stats.disconnected.label',
    value: '450',
    subtextKey: 'stats.disconnected.subtext',
    icon: 'power_off',
    variant: 'amber'
  },
  {
    id: 's4',
    labelKey: 'stats.damaged.label',
    value: '120',
    subtextKey: 'stats.damaged.subtext',
    icon: 'error',
    variant: 'error'
  },
  {
    id: 's6',
    labelKey: 'stats.maintenance.label',
    value: '80',
    subtextKey: 'stats.maintenance.subtext',
    icon: 'build',
    variant: 'bright-gold'
  }
]
