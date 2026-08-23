export interface EngineerDashboardStats {
 totalServiceRequests: number
 completedRequests: number
 pendingRequests: number
 overdueRequests: number
 cancelledRequests: number
 readyEquipment: number
}

export interface ServiceRequestStatusData {
 name: string
 value: number
 color: string
}

export interface EngineerPerformanceData {
 date: string
 completed: number
 assigned: number
}

export interface RecentServiceRequest {
 id: number
 requestNumber: string
 requestType: string // e.g., 'installation', 'maintenance', 'emergency'
 customerName: string
 meterNumber: string
 priority: 'low' | 'medium' | 'high' | 'critical'
 status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
 createdAt: string
}

export interface EngineerActivity {
 id: number
 title: string
 description: string
 timestamp: string
 type: 'assignment' | 'completion' | 'status_change' | 'note'
}

export interface EquipmentSummary {
 total: number
 available: number
 inMaintenance: number
 damaged: number
}
