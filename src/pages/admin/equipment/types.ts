export type EquipmentStatus = 'available' | 'maintenance' | 'damaged' | 'lost'

export interface UserReference {
 id: number
 name: string
 initials?: string
}

export interface Equipment {
 id: number
 user_id: number | null
 equipment_name: string
 serial_number: string | null
 status: EquipmentStatus | null
 notes: string | null
 created_by: number | null
 created_at: string
 updated_at: string
 
 // Optional relationships populated by backend
 user?: UserReference
 createdBy?: UserReference
}

export interface EquipmentStat {
 id: string
 labelKey: string
 value: number | string
 iconKey: string
 variant: 'primary' | 'info' | 'success' | 'warning' | 'error'
}
