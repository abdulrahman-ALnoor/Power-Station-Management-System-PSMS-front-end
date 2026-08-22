import { ServiceRequest, PaginatedResponse } from '../../pages/shared/service-requests/types'
import { mockServiceRequests, mockCustomers, mockMeters } from '../../pages/engineer/service-requests/data/mockData'

export interface GetServiceRequestsParams {
 page?: number
 per_page?: number
 search?: string
 status?: string
 request_type?: string
 priority?: string
 assigned_to?: 'all' | 'me' | 'unassigned'
 created_by?: number // Filter by owner
}

// Mock Current User Context for Frontend Demo
const mockCurrentUser = {
 id: 2, // Mock ID for the Reader user
 name: 'Ahmed Reader',
 role: 'reader'
}

class ServiceRequestService {
 /**
 * Mock API call to get paginated service requests with filtering.
 */
 async getServiceRequests(params: GetServiceRequestsParams): Promise<PaginatedResponse<ServiceRequest>> {
 // Simulate network delay
 await new Promise(resolve => setTimeout(resolve, 800))

 let filtered = [...mockServiceRequests]

 // Filter by ownership (Reader view)
 if (params.created_by) {
 filtered = filtered.filter(req => req.created_by === params.created_by)
 }

 // Filter by search
 if (params.search) {
 const q = params.search.toLowerCase()
 filtered = filtered.filter(
 req =>
 `req-#${req.id}`.toLowerCase().includes(q) ||
 req.customer?.full_name.toLowerCase().includes(q) ||
 req.meter?.meter_number.toLowerCase().includes(q)
 )
 }

 // Filter by status
 if (params.status && params.status !== 'all') {
 filtered = filtered.filter(req => req.status === params.status)
 }

 // Filter by request_type
 if (params.request_type && params.request_type !== 'all') {
 filtered = filtered.filter(req => req.request_type === params.request_type)
 }

 // Filter by priority
 if (params.priority && params.priority !== 'all') {
 filtered = filtered.filter(req => req.priority === params.priority)
 }

 // Filter by engineer assignment
 // (Assuming ID 1 is the currently logged-in engineer for "me" testing)
 if (params.assigned_to) {
 if (params.assigned_to === 'me') {
 filtered = filtered.filter(req => req.assigned_engineer_id === 1)
 } else if (params.assigned_to === 'unassigned') {
 filtered = filtered.filter(req => req.assigned_engineer_id === null)
 }
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

 async createServiceRequest(data: any): Promise<ServiceRequest> {
 await new Promise(resolve => setTimeout(resolve, 600))
 
 // Auto-assigned by the backend based on auth
 const creator = mockCurrentUser

 // Looking up mock relationships to mirror backend eager loading
 const customer = mockCustomers.find(c => c.id === Number(data.customer_id))
 const meter = mockMeters.find(m => m.id === Number(data.meter_id))

 const newRequest: ServiceRequest = {
 id: Math.max(...mockServiceRequests.map(r => r.id), 0) + 1,
 meter_id: Number(data.meter_id),
 customer_id: Number(data.customer_id),
 created_by: creator.id,
 assigned_engineer_id: null,
 request_type: data.request_type,
 priority: data.priority || null,
 status: 'pending',
 description: data.description || null,
 completed_at: null,
 created_at: new Date().toISOString(),
 updated_at: new Date().toISOString(),
 customer,
 meter,
 creator
 }

 mockServiceRequests.unshift(newRequest) // prepend to mock array
 return newRequest
 }

 async getCustomers() {
 await new Promise(resolve => setTimeout(resolve, 300))
 return mockCustomers
 }

 async getMetersByCustomer(customerId: number) {
 await new Promise(resolve => setTimeout(resolve, 300))
 return mockMeters.filter(m => m.customer_id === customerId)
 }
 async updateServiceRequestStatus(id: number, status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'): Promise<ServiceRequest> {
 await new Promise(resolve => setTimeout(resolve, 600))
 
 const requestIndex = mockServiceRequests.findIndex(r => r.id === id)
 if (requestIndex === -1) {
 throw new Error('Service request not found')
 }

 const currentRequest = mockServiceRequests[requestIndex]
 const updatedRequest = { ...currentRequest, status }

 if (status === 'completed') {
 updatedRequest.completed_at = new Date().toISOString()
 }

 mockServiceRequests[requestIndex] = updatedRequest
 return updatedRequest
 }

 async assignServiceRequestToMe(id: number): Promise<ServiceRequest> {
 await new Promise(resolve => setTimeout(resolve, 600))
 
 const requestIndex = mockServiceRequests.findIndex(r => r.id === id)
 if (requestIndex === -1) {
 throw new Error('Service request not found')
 }

 const currentRequest = mockServiceRequests[requestIndex]
 
 // Auto-assigned by the backend based on auth
 const engineer = { id: 1, name: 'Eng. Ahmed Al-Asiri' }

 const updatedRequest = { 
 ...currentRequest, 
 assigned_engineer_id: engineer.id,
 assignedEngineer: engineer,
 status: 'assigned' as const
 }

 mockServiceRequests[requestIndex] = updatedRequest
 return updatedRequest
 }

 async updateServiceRequest(id: number, data: any): Promise<ServiceRequest> {
 await new Promise(resolve => setTimeout(resolve, 600))
 const requestIndex = mockServiceRequests.findIndex(r => r.id === id)
 if (requestIndex === -1) {
 throw new Error('Service request not found')
 }

 const currentRequest = mockServiceRequests[requestIndex]
 
 // Ownership check for the current user
 if (mockCurrentUser.role === 'reader' && currentRequest.created_by !== mockCurrentUser.id) {
 throw new Error('Unauthorized to edit this request')
 }

 const customer = mockCustomers.find(c => c.id === Number(data.customer_id)) || currentRequest.customer
 const meter = mockMeters.find(m => m.id === Number(data.meter_id)) || currentRequest.meter

 const updatedRequest = {
 ...currentRequest,
 meter_id: Number(data.meter_id),
 customer_id: Number(data.customer_id),
 request_type: data.request_type,
 priority: data.priority || null,
 description: data.description || null,
 updated_at: new Date().toISOString(),
 customer,
 meter,
 }

 mockServiceRequests[requestIndex] = updatedRequest
 return updatedRequest
 }

 async deleteServiceRequest(id: number): Promise<void> {
 await new Promise(resolve => setTimeout(resolve, 600))
 const requestIndex = mockServiceRequests.findIndex(r => r.id === id)
 if (requestIndex === -1) {
 throw new Error('Service request not found')
 }
 
 const currentRequest = mockServiceRequests[requestIndex]
 
 // Ownership check for the current user
 if (mockCurrentUser.role === 'reader' && currentRequest.created_by !== mockCurrentUser.id) {
 throw new Error('Unauthorized to delete this request')
 }
 
 // In mock, we just remove it to simulate soft delete filtering
 mockServiceRequests.splice(requestIndex, 1)
 }
}

export const serviceRequestService = new ServiceRequestService()
export { mockCurrentUser }
