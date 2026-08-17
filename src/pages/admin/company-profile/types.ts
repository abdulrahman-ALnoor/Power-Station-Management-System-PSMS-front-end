export interface CompanyProfile {
  id: number
  company_name: string
  logo: string | null
  address: string | null
  whatsapp_number: string | null
  support_number: string | null
  currency: string
  price_per_kwh: number
  reading_cycle_days: number | null
  created_at: string
  updated_at: string
}
