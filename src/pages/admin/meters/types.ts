export type MeterStatus = 'active' | 'disconnected' | 'maintenance' | 'damaged'

/** Minimal reference to a related entity (customer/installer/creator) as returned by MeterResource. */
export interface MeterEntityRef {
  id: number | null
  name: string | null
}

/**
 * Meter shape used throughout the admin UI — mapped from the backend's
 * MeterResource (see services/meters.service.ts for the raw API record + mapper).
 */
export interface Meter {
  id: number
  meter_number: string
  qr_code: string | null
  qr_code_url: string | null
  installation_date: string | null
  installation_location: string | null
  status: MeterStatus | null

  customer_id: number | null
  customerName: string | null

  installed_by: number | null
  installedByName: string | null

  created_by: number | null
  createdByName: string | null

  created_at: string
  updated_at: string
}

/** Payload for creating a meter — matches StoreMeterRequest validation rules. */
export interface CreateMeterPayload {
  customer_id: number
  meter_number: string
  installation_date?: string | null
  installation_location?: string | null
  status?: MeterStatus
  installed_by: number
}

/** Payload for updating a meter — matches UpdateMeterRequest (all fields optional). */
export type UpdateMeterPayload = Partial<CreateMeterPayload>

export interface ServiceRequest {
  id: string
  titleKey: string
  date: string
  statusKey: string
}

export interface MeterStat {
  id: string
  labelKey: string
  value: string | number
  subtextKey: string
  icon: string
  variant: 'primary' | 'green' | 'amber' | 'error' | 'steel-blue' | 'bright-gold'
  trend?: {
    value: string
    type: 'up' | 'down' | 'neutral'
  }
}