import {
 EngineerDashboardStats,
 ServiceRequestStatusData,
 EngineerPerformanceData,
 RecentServiceRequest,
 EngineerActivity,
 EquipmentSummary,
} from '../types'

export const mockEngineerStats: EngineerDashboardStats = {
 totalServiceRequests: 145,
 completedRequests: 89,
 pendingRequests: 32,
 overdueRequests: 5,
 cancelledRequests: 19,
 readyEquipment: 24,
}

export const mockServiceRequestStatus: ServiceRequestStatusData[] = [
 { name: 'pending', value: 32, color: '#f59e0b' },
 { name: 'assigned', value: 45, color: '#3b82f6' },
 { name: 'in_progress', value: 18, color: '#8b5cf6' },
 { name: 'completed', value: 89, color: '#10b981' },
 { name: 'cancelled', value: 19, color: '#ef4444' },
]

export const mockEngineerPerformance: EngineerPerformanceData[] = [
 { date: '2023-10-01', completed: 4, assigned: 5 },
 { date: '2023-10-02', completed: 6, assigned: 6 },
 { date: '2023-10-03', completed: 3, assigned: 7 },
 { date: '2023-10-04', completed: 8, assigned: 4 },
 { date: '2023-10-05', completed: 5, assigned: 5 },
 { date: '2023-10-06', completed: 7, assigned: 8 },
 { date: '2023-10-07', completed: 9, assigned: 6 },
]

export const mockRecentRequests: RecentServiceRequest[] = [
 {
 id: 1,
 requestNumber: 'REQ-2023-001',
 requestType: 'installation',
 customerName: 'Ahmed Ali',
 meterNumber: 'MTR-8932',
 priority: 'high',
 status: 'assigned',
 createdAt: '2023-10-08T09:00:00Z',
 },
 {
 id: 2,
 requestNumber: 'REQ-2023-002',
 requestType: 'maintenance',
 customerName: 'Fatima Zahra',
 meterNumber: 'MTR-1024',
 priority: 'critical',
 status: 'in_progress',
 createdAt: '2023-10-08T10:30:00Z',
 },
 {
 id: 3,
 requestNumber: 'REQ-2023-003',
 requestType: 'emergency',
 customerName: 'Omar Khaled',
 meterNumber: 'MTR-5511',
 priority: 'medium',
 status: 'pending',
 createdAt: '2023-10-08T14:15:00Z',
 },
 {
 id: 4,
 requestNumber: 'REQ-2023-004',
 requestType: 'installation',
 customerName: 'Sara Youssef',
 meterNumber: 'MTR-9988',
 priority: 'low',
 status: 'completed',
 createdAt: '2023-10-07T11:00:00Z',
 },
]

export const mockEngineerActivities: EngineerActivity[] = [
 {
 id: 1,
 title: 'Assigned to REQ-2023-001',
 description: 'You were assigned to meter installation for Ahmed Ali.',
 timestamp: '2023-10-08T09:05:00Z',
 type: 'assignment',
 },
 {
 id: 2,
 title: 'Status changed to In Progress',
 description: 'REQ-2023-002 maintenance started.',
 timestamp: '2023-10-08T10:45:00Z',
 type: 'status_change',
 },
 {
 id: 3,
 title: 'Request Completed',
 description: 'REQ-2023-004 has been marked as completed.',
 timestamp: '2023-10-07T15:30:00Z',
 type: 'completion',
 },
]

export const mockEquipmentSummary: EquipmentSummary = {
 total: 45,
 available: 24,
 inMaintenance: 15,
 damaged: 6,
}
