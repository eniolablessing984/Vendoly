import { createContext, useContext, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const AuthContext = createContext(null)

// Context hooks are exported alongside providers, so Fast Refresh needs this exception.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(){ return useContext(AuthContext) }

export function AuthProvider({ children }){
  const [storageAvailable, setStorageAvailable] = useState(() => {
    try {
      localStorage.getItem('vendor_user')
      return true
    } catch {
      return false
    }
  })
  const [user, setUser] = useState(() => {
    try{
      const raw = localStorage.getItem('vendor_user')
      if (!raw) return null
      const savedUser = JSON.parse(raw)
      if (!savedUser || typeof savedUser !== 'object') return null
      delete savedUser.password
      return savedUser
    }catch{ return null }
  })

  useEffect(() => {
    try {
      if (user) localStorage.setItem('vendor_user', JSON.stringify(user))
      else localStorage.removeItem('vendor_user')
      setStorageAvailable(true)
    } catch {
      setStorageAvailable(false)
    }
  }, [user])

  function signin({ email, storeName }, cb){
    const normalizedEmail = String(email || '').trim().toLowerCase()
    const storeLabel = normalizedEmail.split('@')[0].replace(/[._-]+/g, ' ').trim().replace(/\b\w/g, letter => letter.toUpperCase())
    const fake = { id: `vendor-${normalizedEmail}`, email: normalizedEmail, storeName: storeName?.trim() || (storeLabel ? `${storeLabel} Store` : 'Demo Store') }
    setUser(fake)
    if(cb) cb()
  }

  function signout(cb){
    setUser(null)
    if(cb) cb()
  }

  const value = { user, signin, signout, isAuthenticated: !!user, storageAvailable }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function RequireAuth({ children }){
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  if(!isAuthenticated) return <Navigate to="/signin" state={{ from: location }} replace />
  return children
}

export default AuthContext
