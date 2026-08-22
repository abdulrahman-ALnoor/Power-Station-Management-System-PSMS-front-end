// ============================================================
// Equipment Types
// Matches the Laravel database schema:
// id, user_id, equipment_name, serial_number, status, notes, created_by, timestamps
// ============================================================

export type EquipmentStatus = 'available' | 'maintenance' | 'damaged' | 'lost'

export interface UserSnippet {
  id: number
  name: string
}

export interface Equipment {
  id: number
  user_id: number | null
  equipment_name: string
  serial_number: string | null
  status: EquipmentStatus
  notes: string | null
  created_by: number | null
  created_at: string
  updated_at?: string
  
  // Relations
  user?: UserSnippet | null
  creator?: UserSnippet | null
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}
