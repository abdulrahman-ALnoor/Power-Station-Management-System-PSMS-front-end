import { Equipment } from '../types'

export const mockUsers = [
  { id: 1, name: 'Eng. Ahmed Al-Asiri' },
  { id: 2, name: 'Eng. Khalid Youssef' },
  { id: 3, name: 'Eng. Mohammed Fadel' }
]

export const mockEquipment: Equipment[] = [
  {
    id: 1,
    user_id: 1,
    equipment_name: 'مولد طاقة طوارئ 500KW',
    serial_number: 'SN-9921',
    status: 'available',
    notes: 'حالة ممتازة، تم عمل صيانة دورية الأسبوع الماضي',
    created_by: 2,
    created_at: '2025-10-15T08:30:00Z',
    user: mockUsers.find(u => u.id === 1),
    creator: mockUsers.find(u => u.id === 2)
  },
  {
    id: 2,
    user_id: null,
    equipment_name: 'جهاز اختبار الجهد العالي',
    serial_number: 'HV-TEST-442',
    status: 'maintenance',
    notes: 'يحتاج إلى معايرة سنوية',
    created_by: 1,
    created_at: '2025-11-02T09:15:00Z',
    user: null,
    creator: mockUsers.find(u => u.id === 1)
  },
  {
    id: 3,
    user_id: 2,
    equipment_name: 'كاميرا تصوير حراري',
    serial_number: 'FLIR-88X',
    status: 'damaged',
    notes: 'الشاشة مكسورة، جاري طلب قطعة غيار',
    created_by: 1,
    created_at: '2026-01-20T14:20:00Z',
    user: mockUsers.find(u => u.id === 2),
    creator: mockUsers.find(u => u.id === 1)
  },
  {
    id: 4,
    user_id: null,
    equipment_name: 'معدات سلامة متكاملة (طقم)',
    serial_number: null,
    status: 'lost',
    notes: 'مفقود منذ التدخل في محطة الشمال',
    created_by: 2,
    created_at: '2026-02-11T10:00:00Z',
    user: null,
    creator: mockUsers.find(u => u.id === 2)
  },
  {
    id: 5,
    user_id: 3,
    equipment_name: 'جهاز قياس المقاومة الأرضية',
    serial_number: 'ER-553',
    status: 'available',
    notes: null,
    created_by: 1,
    created_at: '2026-03-05T11:45:00Z',
    user: mockUsers.find(u => u.id === 3),
    creator: mockUsers.find(u => u.id === 1)
  },
  {
    id: 6,
    user_id: null,
    equipment_name: 'رافعة شوكية 3 طن',
    serial_number: 'FL-3T-009',
    status: 'maintenance',
    notes: 'تغيير زيت وفلاتر',
    created_by: 1,
    created_at: '2026-04-10T08:00:00Z',
    user: null,
    creator: mockUsers.find(u => u.id === 1)
  },
  {
    id: 7,
    user_id: 1,
    equipment_name: 'محلل جودة الطاقة',
    serial_number: 'PQA-700',
    status: 'available',
    notes: 'تم تحديث البرنامج الثابت مؤخراً',
    created_by: 1,
    created_at: '2026-05-15T13:30:00Z',
    user: mockUsers.find(u => u.id === 1),
    creator: mockUsers.find(u => u.id === 1)
  }
]
