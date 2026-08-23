import { Equipment, PaginatedResponse, EquipmentStatus } from '../../pages/shared/equipment/types'
import { mockEquipment, mockUsers } from '../../pages/shared/equipment/data/mockData'

export interface GetEquipmentParams {
 page?: number
 per_page?: number
 search?: string
 status?: string
}

class EquipmentService {
 /**
 * Mock API call to get paginated equipment with filtering.
 */
 async getEquipment(params: GetEquipmentParams): Promise<PaginatedResponse<Equipment>> {
 // Simulate network delay
 await new Promise(resolve => setTimeout(resolve, 800))

 let filtered = [...mockEquipment]

 // Filter by search
 if (params.search) {
 const q = params.search.toLowerCase()
 filtered = filtered.filter(
 item =>
 item.equipment_name.toLowerCase().includes(q) ||
 (item.serial_number && item.serial_number.toLowerCase().includes(q))
 )
 }

 // Filter by status
 if (params.status && params.status !== 'all') {
 filtered = filtered.filter(item => item.status === params.status)
 }

 // Pagination
 const page = params.page || 1
 const perPage = params.per_page || 10
 const total = filtered.length
 const lastPage = Math.ceil(total / perPage)
 const from = (page - 1) * perPage
 const to = from + perPage

 const paginatedData = filtered.slice(from, to)

 return {
 data: paginatedData,
 current_page: page,
 last_page: lastPage,
 per_page: perPage,
 total,
 from: from + 1,
 to: Math.min(to, total),
 }
 }

 async createEquipment(data: Partial<Equipment>): Promise<Equipment> {
 await new Promise(resolve => setTimeout(resolve, 600))
 
 // Check for duplicate serial number (if provided)
 if (data.serial_number) {
 const isDuplicate = mockEquipment.some(e => e.serial_number === data.serial_number)
 if (isDuplicate) {
 throw new Error('duplicate_serial')
 }
 }

 // Auto-assigned by the backend based on auth
 const creator = { id: 1, name: 'Eng. Ahmed Al-Asiri' }

 let assignedUser = null
 if (data.user_id) {
 assignedUser = mockUsers.find(u => u.id === Number(data.user_id)) || null
 }

 const newEquipment: Equipment = {
 id: Math.max(...mockEquipment.map(e => e.id), 0) + 1,
 user_id: data.user_id ? Number(data.user_id) : null,
 equipment_name: data.equipment_name!,
 serial_number: data.serial_number || null,
 status: data.status || 'available',
 notes: data.notes || null,
 created_by: creator.id,
 created_at: new Date().toISOString(),
 updated_at: new Date().toISOString(),
 user: assignedUser,
 creator
 }

 mockEquipment.unshift(newEquipment) // prepend to mock array
 return newEquipment
 }

 async updateEquipmentStatus(id: number, status: EquipmentStatus): Promise<Equipment> {
 await new Promise(resolve => setTimeout(resolve, 600))
 
 const index = mockEquipment.findIndex(e => e.id === id)
 if (index === -1) {
 throw new Error('Equipment not found')
 }

 const currentItem = mockEquipment[index]
 const updatedItem = { ...currentItem, status, updated_at: new Date().toISOString() }

 mockEquipment[index] = updatedItem
 return updatedItem
 }

 async getUsers() {
 await new Promise(resolve => setTimeout(resolve, 300))
 return mockUsers
 }
}

export const equipmentService = new EquipmentService()
