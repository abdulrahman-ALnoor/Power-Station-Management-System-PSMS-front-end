export interface ReaderDashboardStats {
  totalReadings: number
  todayReadings: number
  overdueReadings: number
  serviceRequests: number
}

export interface ReaderReadingProgress {
  completed: number
  total: number
  percentage: number
}

export interface ReaderReading {
  id: string
  meterNumber: string
  customerName: string
  previousReading: number
  currentReading: number
  consumption: string
  date: string
  status: 'completed' | 'review' | 'late'
}

export interface ReaderNotification {
  id: string
  title: string
  description: string
  type: 'late' | 'update' | 'service'
  date: string
}

export interface ReaderConsumptionData {
  day: string
  consumption: number
}

export interface ReaderDashboardResponse {
  stats: ReaderDashboardStats
  progress: ReaderReadingProgress
  latestReadings: ReaderReading[]
  notifications: ReaderNotification[]
  consumptionChart: ReaderConsumptionData[]
}
