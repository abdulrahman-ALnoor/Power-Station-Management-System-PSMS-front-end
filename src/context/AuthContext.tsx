// ============================================================
// AuthContext — Authentication state (placeholder)
// Will be connected to Laravel API token auth in later steps
// ============================================================

import {
 createContext,
 useContext,
 useState,
 useCallback,
 type ReactNode,
} from 'react'
import { STORAGE_KEYS } from '@/config/constants'
import type { AuthUser } from '@/types/common'

interface AuthContextValue {
 user: AuthUser | null
 token: string | null
 isAuthenticated: boolean
 isLoading: boolean
 /** Placeholder — will call auth.service.ts in Step 2 */
 login: (token: string, user: AuthUser) => void
 logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
 children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
 const [user, setUser] = useState<AuthUser | null>(null)
 const [token, setToken] = useState<string | null>(() =>
 localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
 )
 const [isLoading] = useState(false)

 const login = useCallback((newToken: string, newUser: AuthUser) => {
 localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken)
 setToken(newToken)
 setUser(newUser)
 }, [])

 const logout = useCallback(() => {
 localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
 setToken(null)
 setUser(null)
 }, [])

 return (
 <AuthContext.Provider
 value={{
 user,
 token,
 isAuthenticated: !!token,
 isLoading,
 login,
 logout,
 }}
 >
 {children}
 </AuthContext.Provider>
 )
}

export function useAuthContext(): AuthContextValue {
 const ctx = useContext(AuthContext)
 if (!ctx) {
 throw new Error('useAuthContext must be used inside <AuthProvider>')
 }
 return ctx
}
