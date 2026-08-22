/**
 * meterLookupService.ts
 * 
 * Mock service to look up meter details (like previous reading).
 * To be replaced with actual Axios calls to Laravel backend.
 */

import { ParsedMeterInfo } from '../../pages/shared/readings/utils/qrMeterParser'

export interface MeterDetails {
  id: number
  meter_number: string
  previous_reading: number
}

// Mock database to match the hardcoded options in AddMeterReadingModal
const MOCK_METERS: MeterDetails[] = [
  { id: 101, meter_number: 'MET-10001', previous_reading: 1250 },
  { id: 102, meter_number: 'MET-10002', previous_reading: 3420 },
  { id: 103, meter_number: 'MET-10003', previous_reading: 890 },
  { id: 104, meter_number: 'MET-10004', previous_reading: 5600 },
  { id: 105, meter_number: 'MET-10005', previous_reading: 2100 },
]

export const meterLookupService = {
  /**
   * Look up a meter by ID or Number.
   */
  async lookupMeter(parsed: ParsedMeterInfo): Promise<MeterDetails | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    if (parsed.meterId) {
      return MOCK_METERS.find(m => m.id === parsed.meterId) || null
    }

    if (parsed.meterNumber) {
      return MOCK_METERS.find(m => m.meter_number.toUpperCase() === parsed.meterNumber?.toUpperCase()) || null
    }

    return null
  }
}
