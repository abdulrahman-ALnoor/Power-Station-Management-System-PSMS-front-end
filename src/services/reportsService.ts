import apiClient from './api'
import type {
  PaginatedData,
  CustomerReportItem,
  MeterReportItem,
  ReadingReportItem,
  InvoiceReportItem,
  ServiceRequestReportItem,
  EquipmentReportItem,
  EmployeeReportItem,
  ComprehensiveReportData,
} from '@/types/reports'

export interface ReportQueryParams {
  page?: number
  per_page?: number
  from_date?: string
  to_date?: string
  status?: string
  customer_type?: string
  request_type?: string
  role?: string
  search?: string
  year?: number
}

export interface ReportApiResponse<T> {
  success: boolean
  stats?: Record<string, any>
  chart_data?: any[]
  monthly_chart?: any[]
  top_consumers?: any[]
  overview?: ComprehensiveReportData['overview']
  currency?: string
  data?: PaginatedData<T> | T[]
}

class ReportsService {
  /** 1. Customer Report */
  async getCustomerReport(params: ReportQueryParams): Promise<ReportApiResponse<CustomerReportItem>> {
    const res = await apiClient.get<ReportApiResponse<CustomerReportItem>>('/reports/customers', { params })
    return res.data
  }

  /** 2. Meter Report */
  async getMeterReport(params: ReportQueryParams): Promise<ReportApiResponse<MeterReportItem>> {
    const res = await apiClient.get<ReportApiResponse<MeterReportItem>>('/reports/meters', { params })
    return res.data
  }

  /** 3. Reading Report */
  async getReadingReport(params: ReportQueryParams): Promise<ReportApiResponse<ReadingReportItem>> {
    const res = await apiClient.get<ReportApiResponse<ReadingReportItem>>('/reports/readings', { params })
    return res.data
  }

  /** 4. Consumption Report */
  async getConsumptionReport(params: ReportQueryParams): Promise<ReportApiResponse<any>> {
    const res = await apiClient.get<ReportApiResponse<any>>('/reports/consumption', { params })
    return res.data
  }

  /** 5. Invoice Report */
  async getInvoiceReport(params: ReportQueryParams): Promise<ReportApiResponse<InvoiceReportItem>> {
    const res = await apiClient.get<ReportApiResponse<InvoiceReportItem>>('/reports/invoices', { params })
    return res.data
  }

  /** 6. Collection Report */
  async getCollectionReport(params: ReportQueryParams): Promise<ReportApiResponse<InvoiceReportItem>> {
    const res = await apiClient.get<ReportApiResponse<InvoiceReportItem>>('/reports/collections', { params })
    return res.data
  }

  /** 7. Revenue Report */
  async getRevenueReport(params: ReportQueryParams): Promise<ReportApiResponse<any>> {
    const res = await apiClient.get<ReportApiResponse<any>>('/reports/revenue', { params })
    return res.data
  }

  /** 8. Service Request Report */
  async getServiceRequestReport(params: ReportQueryParams): Promise<ReportApiResponse<ServiceRequestReportItem>> {
    const res = await apiClient.get<ReportApiResponse<ServiceRequestReportItem>>('/reports/service-requests', { params })
    return res.data
  }

  /** 9. Equipment Report */
  async getEquipmentReport(params: ReportQueryParams): Promise<ReportApiResponse<EquipmentReportItem>> {
    const res = await apiClient.get<ReportApiResponse<EquipmentReportItem>>('/reports/equipment', { params })
    return res.data
  }

  /** 10. Employee Report */
  async getEmployeeReport(params: ReportQueryParams): Promise<ReportApiResponse<EmployeeReportItem>> {
    const res = await apiClient.get<ReportApiResponse<EmployeeReportItem>>('/reports/employees', { params })
    return res.data
  }

  /** 11. Comprehensive Overview Report */
  async getComprehensiveReport(params: ReportQueryParams): Promise<ReportApiResponse<any>> {
    const res = await apiClient.get<ReportApiResponse<any>>('/reports/comprehensive', { params })
    return res.data
  }
}

export const reportsService = new ReportsService()
export default reportsService
