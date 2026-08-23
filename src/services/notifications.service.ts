// ============================================================
// Notifications service — backend route: GET /notifications
// ============================================================

import apiClient from './api'
import type { ApiResponse } from '@/types/api'

export interface NotificationApiRecord {
  id: number
  customer: { id: number; name: string } | null
  meter_reading: { id: number; reading: number } | null
  invoice: { id: number; invoice_number: string } | null
  notification_type: string
  message: string
  status: string
  sent_at: string | null
  read_at: string | null
  created_at: string
}

export async function fetchNotifications(): Promise<NotificationApiRecord[]> {
  const response = await apiClient.get<ApiResponse<NotificationApiRecord[]>>('/notifications')
  return response.data.data
}
