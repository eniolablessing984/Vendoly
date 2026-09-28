import { createContext, useContext, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const AuthContext = createContext(null)

// Context hooks are exported alongside providers, so Fast Refresh needs this exception.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(){ return useContext(AuthContext) }

export function AuthProvider({ children }){
  const [user, setUser] = useState(() => {
    try{ const raw = localStorage.getItem('vendor_user'); return raw ? JSON.parse(raw) : null }catch{ return null }
  })

  useEffect(() => {
    try {
      if (user) localStorage.setItem('vendor_user', JSON.stringify(user))
      else localStorage.removeItem('vendor_user')
    } catch {
      // Authentication can still work for this session when storage is unavailable.
    }
  }, [user])

  function signin({ email, password }, cb){
    const fake = { id: 'vendor-1', email, password }
    setUser(fake)
    if(cb) cb()
  }

  function signout(cb){
    setUser(null)
    if(cb) cb()
  }

  const value = { user, signin, signout, isAuthenticated: !!user }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function RequireAuth({ children }){
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  if(!isAuthenticated) return <Navigate to="/signin" state={{ from: location }} replace />
  return children
}

export default AuthContext
