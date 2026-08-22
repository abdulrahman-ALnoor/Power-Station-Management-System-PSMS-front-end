export type ReadingMethod = 'manual' | 'qr_scan'

export type ReadingStatus = 'pending' | 'approved' | 'rejected'

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
  updated_at: string
  
  // Relationships based on Laravel
  meter?: {
    id: number
    meter_number: string
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

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}
