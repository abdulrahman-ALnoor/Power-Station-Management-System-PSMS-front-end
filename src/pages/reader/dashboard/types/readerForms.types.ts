// ============================================================
// Future Backend Contracts — Reader Dashboard Forms
// ============================================================

export type ReadingMethod = 'manual' | 'qr_scan'

export type ServiceRequestType = 'new_connection' | 'maintenance' | 'disconnection'
export type ServiceRequestPriority = 'low' | 'medium' | 'high' | 'emergency'
export type ServiceRequestStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'

// ── Temporary Frontend Entities ────────────────────────────────

export interface MockCustomer {
 id: number
 name: string
 phone: string
}

export interface MockMeterInfo {
 id: number
 meterNumber: string
 customer: MockCustomer
 previousReading: number
 pricePerKwh: number
}

// ── Payloads for Future Laravel API ────────────────────────────

/**
 * Payload sent to create a new meter reading.
 * Contains only fields that the Reader is allowed to submit.
 */
export interface CreateMeterReadingPayload {
 meter_id: number
 current_reading: number
 consumption: number
 price_per_kwh: number
 reading_cost: number
 reading_date: string // YYYY-MM-DD
 reading_method: ReadingMethod
 notes?: string | null
}

/**
 * Payload sent to create a new service request.
 * Contains only fields that the Reader is allowed to submit.
 */
export interface CreateServiceRequestPayload {
 meter_id: number
 customer_id: number
 request_type: ServiceRequestType
 priority: ServiceRequestPriority
 description?: string | null
}
