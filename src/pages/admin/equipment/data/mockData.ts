import { Equipment, EquipmentStat } from '../types'

export const MOCK_EQUIPMENT: Equipment[] = [
 {
 id: 1,
 user_id: 12,
 equipment_name: 'مولد طاقة طوارئ 500KW',
 serial_number: 'SN-9921',
 status: 'available',
 notes: 'حالة ممتازة، جاهز للاستخدام',
 created_by: 1,
 created_at: '2024-01-10T00:00:00Z',
 updated_at: '2024-01-10T00:00:00Z',
 user: {
 id: 12,
 name: 'أحمد منصور',
 initials: 'أ م'
 },
 createdBy: {
 id: 1,
 name: 'المدير العام'
 }
 },
 {
 id: 2,
 user_id: null,
 equipment_name: 'رافعة شوكية هيدروليكية',
 serial_number: 'SN-4022',
 status: 'maintenance',
 notes: 'يحتاج إلى فحص دوري للزيت',
 created_by: 1,
 created_at: '2024-02-15T00:00:00Z',
 updated_at: '2024-03-01T00:00:00Z',
 createdBy: {
 id: 1,
 name: 'المدير العام'
 }
 },
 {
 id: 3,
 user_id: 15,
 equipment_name: 'كابل جهد عالي 100م',
 serial_number: 'SN-1100',
 status: 'damaged',
 notes: 'قطع في الغلاف الخارجي، جاري التبديل',
 created_by: 1,
 created_at: '2024-03-20T00:00:00Z',
 updated_at: '2024-04-10T00:00:00Z',
 user: {
 id: 15,
 name: 'خالد العتيبي',
 initials: 'خ ع'
 },
 createdBy: {
 id: 1,
 name: 'المدير العام'
 }
 },
 {
 id: 4,
 user_id: null,
 equipment_name: 'جهاز فحص العزل',
 serial_number: 'SN-8833',
 status: 'lost',
 notes: 'مفقود منذ آخر عملية ميدانية في المحطة الشرقية',
 created_by: 1,
 created_at: '2024-04-05T00:00:00Z',
 updated_at: '2024-05-12T00:00:00Z',
 createdBy: {
 id: 1,
 name: 'المدير العام'
 }
 }
]

export const getEquipmentStats = (equipmentList: Equipment[]): EquipmentStat[] => {
 const total = equipmentList.length
 const available = equipmentList.filter(item => item.status === 'available').length
 const maintenance = equipmentList.filter(item => item.status === 'maintenance').length
 const damaged = equipmentList.filter(item => item.status === 'damaged').length
 const lost = equipmentList.filter(item => item.status === 'lost').length

 return [
 {
 id: 'total',
 labelKey: 'stats.total',
 value: total,
 iconKey: 'layers',
 variant: 'primary'
 },
 {
 id: 'available',
 labelKey: 'stats.available',
 value: available,
 iconKey: 'check_circle',
 variant: 'success'
 },
 {
 id: 'maintenance',
 labelKey: 'stats.maintenance',
 value: maintenance,
 iconKey: 'build',
 variant: 'warning'
 },
 {
 id: 'damaged',
 labelKey: 'stats.damaged',
 value: damaged,
 iconKey: 'report_problem',
 variant: 'error'
 },
 {
 id: 'lost',
 labelKey: 'stats.lost',
 value: lost,
 iconKey: 'search_off',
 variant: 'error' // Using existing error semantic color, could customize later if needed
 }
 ]
}
