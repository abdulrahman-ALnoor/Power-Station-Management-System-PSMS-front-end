// ============================================================
// AuthContext — Authentication state
// Connected to Laravel API token auth in Step 1.2
// ============================================================

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import { STORAGE_KEYS } from '@/config/constants'
import { getMeRequest, logoutRequest } from '@/services/auth.service'
import type { AuthUser } from '@/types/common'

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
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
  // Starts true: on first mount we must verify any saved token against the
  // server (GET /me) before deciding whether the user is really logged in.
  const [isLoading, setIsLoading] = useState(true)

  const login = useCallback((newToken: string, newUser: AuthUser) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken)
    setToken(newToken)
    setUser(newUser)
  }, [])

  const logout = useCallback(() => {
    // Fire-and-forget: revoke the token server-side, but clear local state
    // immediately regardless of whether the request succeeds (e.g. token
    // already expired) so the user is never stuck unable to log out.
    logoutRequest().catch(() => {
      // Ignore errors — local session is cleared below either way.
    })
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    setToken(null)
    setUser(null)
  }, [])

  // On app load: if a token exists in localStorage, validate it against
  // the backend and restore the user (role + permissions). If it's
  // invalid/expired, the api.ts interceptor will already have cleared it
  // on the 401, so we just clean up local state here too.
  useEffect(() => {
    const savedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)

    if (!savedToken) {
      setIsLoading(false)
      return
    }

    getMeRequest()
      .then((userInfo) => {
        setUser({
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          role: userInfo.role as AuthUser['role'],
          permissions: userInfo.permissions,
        })
        setToken(savedToken)
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
        setToken(null)
        setUser(null)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuthContext must be used inside <AuthProvider>')
  }
  return ctx
}