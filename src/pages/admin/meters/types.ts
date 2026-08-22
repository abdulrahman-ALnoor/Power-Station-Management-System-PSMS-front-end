export type MeterStatus = 'active' | 'disconnected' | 'maintenance' | 'damaged'

export interface Meter {
 id: number
 customer_id: number
 customerName?: string // Helper field from relations
 meter_number: string
 qr_code: string
 installation_date: string | null
 installation_location: string | null
 status: MeterStatus | null
 installed_by: number
 installedByName?: string // Helper field from relations
 created_by: number | null
}

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
