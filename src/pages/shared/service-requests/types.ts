export type ServiceRequestType = 'new_connection' | 'maintenance' | 'disconnection'
export type ServiceRequestPriority = 'low' | 'medium' | 'high' | 'emergency'
export type ServiceRequestStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'

export interface ServiceRequest {
 id: number
 meter_id: number
 customer_id: number
 created_by: number
 assigned_engineer_id: number | null
 request_type: ServiceRequestType
 priority: ServiceRequestPriority | null
 status: ServiceRequestStatus
 description: string | null
 completed_at: string | null
 created_at: string
 updated_at: string
 deleted_at?: string | null

 // Relationship display data
 customer?: {
 id: number
 full_name: string
 }
 meter?: {
 id: number
 meter_number: string
 }
 creator?: {
 id: number
 name: string
 }
 assignedEngineer?: {
 id: number
 name: string
 }
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

export interface ServiceRequestFormData {
 customer_id: number | ''
 meter_id: number | ''
 request_type: ServiceRequestType | ''
 priority: ServiceRequestPriority | ''
 description: string
}
