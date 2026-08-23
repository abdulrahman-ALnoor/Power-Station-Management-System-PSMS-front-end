// ============================================================
// useAuth — Convenience hook for auth context
// ============================================================

import { useAuthContext } from '@/context/AuthContext'

export function useAuth() {
 return useAuthContext()
}
