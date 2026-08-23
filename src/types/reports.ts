export interface PaginatedData<T> {
  current_page: number
  data: T[]
  last_page: number
  per_page: number
  total: number
  from?: number
  to?: number
}

export interface CustomerReportItem {
  id: number
  customer_number: string
  full_name: string
  customer_type: 'residential' | 'commercial' | 'industrial'
  phone?: string
  address?: string
  meters_count: number
  created_at: string
}

export interface MeterReportItem {
  id: number
  meter_number: string
  qr_code?: string
  installation_location?: string
  installation_date?: string
  status: 'active' | 'disconnected' | 'maintenance' | 'damaged'
  created_at: string
  customer?: {
    id: number
    full_name: string
  }
}

export interface ReadingReportItem {
  id: number
  previous_reading: number
  current_reading: number
  consumption: number
  price_per_kwh: number
  reading_cost: number
  reading_date: string
  reading_method: 'manual' | 'qr_scan'
  status: 'approved' | 'pending' | 'rejected'
  notes?: string
  meter?: {
    id: number
    meter_number: string
    customer?: {
      id: number
      full_name: string
    }
  }
  creator?: {
    id: number
    name: string
  }
}

export interface InvoiceReportItem {
  id: number
  invoice_number: string
  total_amount: number
  paid_amount: number
  remaining_amount: number
  issue_date: string
  due_date?: string
  status: 'paid' | 'partially_paid' | 'unpaid'
  customer?: {
    id: number
    full_name: string
  }
  meter?: {
    id: number
    meter_number: string
  }
  accountant?: {
    id: number
    name: string
  }
}

export interface ServiceRequestReportItem {
  id: number
  request_type: string
  priority: 'low' | 'medium' | 'high' | 'emergency'
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
  description?: string
  created_at: string
  completed_at?: string
  customer?: {
    id: number
    full_name: string
  }
  meter?: {
    id: number
    meter_number: string
  }
  assignedEngineer?: {
    id: number
    name: string
  }
}

export interface EquipmentReportItem {
  id: number
  equipment_name: string
  serial_number?: string
  status: 'available' | 'maintenance' | 'damaged' | 'lost'
  notes?: string
  created_at: string
  user?: {
    id: number
    name: string
  }
}

export interface EmployeeReportItem {
  id: number
  name: string
  email: string
  roles?: { id: number; name: string }[]
  created_at: string
}

export interface ComprehensiveReportData {
  currency: string
  overview: {
    total_customers: number
    total_meters: number
    active_meters: number
    total_readings: number
    total_consumption_kwh: number
    total_invoices: number
    total_billed_amount: number
    total_collected_amount: number
    total_remaining_amount: number
    total_service_requests: number
    completed_service_requests: number
    total_equipment: number
    total_employees: number
  }
}
