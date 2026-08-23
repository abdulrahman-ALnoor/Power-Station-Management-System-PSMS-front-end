// ============================================================
// Service Abstraction — Reader Dashboard Forms
// Prepares frontend boundaries for future Laravel API connection
// ============================================================

import {
 MockMeterInfo,
 CreateMeterReadingPayload,
 CreateServiceRequestPayload,
} from '../pages/reader/dashboard/types/readerForms.types'

// ── TEMPORARY FRONTEND DATA ADAPTER ─────────────────────────────
// This data will be replaced by the future Laravel API responses.

const MOCK_METERS: MockMeterInfo[] = [
 {
 id: 1,
 meterNumber: 'MET-10001',
 customer: { id: 101, name: 'أحمد محمد عبدلله', phone: '770000001' },
 previousReading: 12450,
 pricePerKwh: 250,
 },
 {
 id: 2,
 meterNumber: 'MET-10002',
 customer: { id: 102, name: 'مؤسسة النور التجارية', phone: '770000002' },
 previousReading: 45890,
 pricePerKwh: 300,
 },
 {
 id: 3,
 meterNumber: 'MET-10003',
 customer: { id: 103, name: 'خالد صالح علي', phone: '770000003' },
 previousReading: 890,
 pricePerKwh: 250,
 },
]

// ── API SERVICE METHODS ────────────────────────────────────────

/**
 * Retrieves the available meters that this reader can add readings for.
 * Future: Will call GET /api/reader/meters
 */
export async function getReaderMeters(): Promise<MockMeterInfo[]> {
 // Simulate network delay
 return new Promise((resolve) => {
 setTimeout(() => {
 resolve(MOCK_METERS)
 }, 600)
 })
}

/**
 * Submits a new meter reading.
 * Future: Will call POST /api/reader/readings with the validated payload.
 */
export async function submitMeterReading(payload: CreateMeterReadingPayload): Promise<{ success: boolean }> {
 // Simulate network delay and successful submission
 return new Promise((resolve) => {
 setTimeout(() => {
 console.log('Mock API - Reading Submitted:', payload)
 resolve({ success: true })
 }, 1000)
 })
}

/**
 * Submits a new service request.
 * Future: Will call POST /api/reader/service-requests with the validated payload.
 */
export async function submitServiceRequest(payload: CreateServiceRequestPayload): Promise<{ success: boolean }> {
 // Simulate network delay and successful submission
 return new Promise((resolve) => {
 setTimeout(() => {
 console.log('Mock API - Service Request Submitted:', payload)
 resolve({ success: true })
 }, 1000)
 })
}
