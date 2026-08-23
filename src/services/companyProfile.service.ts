// ============================================================
// Company Profile service — backend routes (routes/api.php):
//   GET /company-profiles           (permission: company-profiles.view)
//   PUT /company-profiles/{id}      (permission: company-profiles.update)
// The company profile is a SINGLETON record — there's only ever one row.
// Note: `logo` is validated as a plain string (URL/path) on the backend —
// there is no real file-upload endpoint for it yet.
// ============================================================

import apiClient from './api'
import type { ApiResponse } from '@/types/api'
import type { CompanyProfile } from '@/pages/admin/company-profile/types'

export async function fetchCompanyProfile(): Promise<CompanyProfile> {
  const response = await apiClient.get<ApiResponse<CompanyProfile>>('/company-profiles')
  return response.data.data
}

export interface UpdateCompanyProfilePayload {
  company_name?: string
  logo?: string | null
  address?: string | null
  whatsapp_number?: string | null
  support_number?: string | null
  currency?: string
  price_per_kwh?: number
  reading_cycle_days?: number | null
}

export async function updateCompanyProfile(
  id: number,
  payload: UpdateCompanyProfilePayload,
): Promise<CompanyProfile> {
  const response = await apiClient.put<ApiResponse<CompanyProfile>>(
    `/company-profiles/${id}`,
    payload,
  )
  return response.data.data
}
