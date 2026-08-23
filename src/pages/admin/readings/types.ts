export type ReadingMethod = 'manual' | 'qr_scan'

export type ReadingStatus = 'pending' | 'approved' | 'rejected'

/**
 * Mapped (frontend-friendly) shape of a meter reading.
 * NOTE: the backend's MeterReadingResource does NOT return `updated_at` at all
 * (only `created_at`) — do not rely on it. Also note previous_reading,
 * current_reading, consumption, price_per_kwh and reading_cost are Eloquent
 * `decimal:2` casts, which Laravel serializes as JSON STRINGS (e.g. "125.00"),
 * not numbers — the service's mapper converts them to real numbers.
 */
export interface MeterReading {
  id: number
  created_by: number | null
  meter_id: number
  previous_reading: number
  current_reading: number
  consumption: number
  price_per_kwh: number
  reading_cost: number
  reading_date: string
  reading_method: ReadingMethod | null
  status: ReadingStatus | null
  notes: string | null
  created_at: string

  meter?: {
    id: number
    meter_number: string
    customerName?: string | null
  }
  createdBy?: {
    id: number
    name: string
  }
}

export interface MeterReadingStatsData {
  totalReadings: number
  approvedReadings: number
  pendingReadings: number
  rejectedReadings: number
  totalConsumption: number
  totalReadingCost: number
}

/** Payload for creating a reading — matches StoreMeterReadingRequest.
 *  previous_reading and price_per_kwh are calculated server-side; do not send them. */
export interface CreateReadingPayload {
  meter_id: number
  current_reading: number
  reading_date: string
  reading_method?: ReadingMethod
  notes?: string | null
}

/** Payload for updating a reading — matches UpdateMeterReadingRequest.
 *  Only the last reading for a meter can be edited, and only if it has no
 *  linked invoice yet (enforced server-side; surfaced here via API error). */
export interface UpdateReadingPayload {
  current_reading?: number
  reading_date?: string
  reading_method?: ReadingMethod
  notes?: string | null
  status?: ReadingStatus
}