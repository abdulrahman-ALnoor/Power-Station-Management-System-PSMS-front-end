import { MeterReading, PaginatedResponse } from '../../pages/shared/readings/types'
import { MOCK_METER_READINGS } from '../../pages/shared/readings/data/mockData'

export interface GetReadingsParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
  method?: string
  date?: string
}

class ReadingService {
  async getReadings(params: GetReadingsParams): Promise<PaginatedResponse<MeterReading>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))

    let filtered = [...MOCK_METER_READINGS]

    // Filter by search
    if (params.search) {
      const q = params.search.toLowerCase()
      filtered = filtered.filter(
        item =>
          item.id.toString().includes(q) ||
          item.meter?.meter_number.toLowerCase().includes(q) ||
          item.meter_id.toString().includes(q)
      )
    }

    // Filter by status
    if (params.status && params.status !== 'all') {
      filtered = filtered.filter(item => item.status === params.status)
    }

    // Filter by method
    if (params.method && params.method !== 'all') {
      filtered = filtered.filter(item => item.reading_method === params.method)
    }

    // Filter by date
    if (params.date && params.date !== 'all') {
      const today = new Date()
      filtered = filtered.filter(item => {
        const readingDate = new Date(item.reading_date)
        if (params.date === 'today') {
          return readingDate.toDateString() === today.toDateString()
        } else if (params.date === 'this_week') {
          const firstDay = new Date(today.setDate(today.getDate() - today.getDay()))
          return readingDate >= firstDay
        } else if (params.date === 'this_month') {
          return readingDate.getMonth() === today.getMonth() && readingDate.getFullYear() === today.getFullYear()
        }
        return true
      })
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
}

export const readingService = new ReadingService()
