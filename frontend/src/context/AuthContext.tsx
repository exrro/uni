/** Auth context: holds JWT + role, persisted in localStorage. */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

interface AuthState {
  token: string | null
  role: string | null
  sub: string | null
  isAuthenticated: boolean
}

interface AuthContextValue extends AuthState {
  login: (token: string, role: string, sub: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadToken(): AuthState {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  const sub = localStorage.getItem('sub')
  return { token, role, sub, isAuthenticated: !!token }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(loadToken)

  const login = useCallback((token: string, role: string, sub: string) => {
    localStorage.setItem('token', token)
    localStorage.setItem('role', role)
    localStorage.setItem('sub', sub)
    setState({ token, role, sub, isAuthenticated: true })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('sub')
    setState({ token: null, role: null, sub: null, isAuthenticated: false })
  }, [])

  const value = useMemo(() => ({ ...state, login, logout }), [state, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
