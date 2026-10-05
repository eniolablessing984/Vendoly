import { createContext, useContext, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import * as applicationService from '../data/sellerApplicationService'

const AuthContext = createContext(null)

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase()
}

function getDisplayName(user) {
  if (!user || typeof user !== 'object') return 'Customer'
  if (user.name?.trim()) return user.name.trim()
  if (user.storeName?.trim()) return user.storeName.trim()
  const email = normalizeEmail(user.email)
  return email ? email.split('@')[0] : 'Customer'
}

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
      const safeUser = { ...savedUser }
      delete safeUser.password
      return safeUser
    }catch{ return null }
  })

  function persistUser(nextUser){
    try {
      if (nextUser) localStorage.setItem('vendor_user', JSON.stringify(nextUser))
      else localStorage.removeItem('vendor_user')
      setStorageAvailable(true)
    } catch {
      setStorageAvailable(false)
    }
  }

  function signin({ email, password, storeName, name, role = 'customer', logo = '' }, cb){
    const normalizedEmail = normalizeEmail(email)
    const trimmedPassword = String(password || '').trim()
    if (!normalizedEmail || !trimmedPassword) {
      if (cb) cb()
      return false
    }

    if (role === 'admin') {
      const adminAllowed = normalizedEmail === 'admin@vendorly.com' && trimmedPassword === 'admin123'
      if (!adminAllowed) {
        if (cb) cb()
        return false
      }
    }

    if (role === 'seller') {
      const approvedSeller = applicationService.isSellerApproved(normalizedEmail)
      if (!approvedSeller) {
        if (cb) cb()
        return false
      }
    }

    const nextUser = {
      id: role === 'seller' ? `vendor-${normalizedEmail}` : role === 'admin' ? `admin-${normalizedEmail}` : `customer-${normalizedEmail}`,
      email: normalizedEmail,
      role,
      name: String(name || '').trim() || getDisplayName({ storeName, email: normalizedEmail }),
      storeName: String(storeName || '').trim() || (role === 'seller' ? `${getDisplayName({ email: normalizedEmail })} Store` : ''),
      logo: String(logo || '').trim(),
    }

    persistUser(nextUser)
    setUser(nextUser)
    if(cb) cb()
    return true
  }

  function signup({ name, email, password }, cb){
    const normalizedEmail = normalizeEmail(email)
    if (!normalizedEmail || !String(password || '').trim()) {
      if (cb) cb()
      return false
    }

    const nextUser = {
      id: `customer-${normalizedEmail}`,
      email: normalizedEmail,
      role: 'customer',
      name: String(name || '').trim() || getDisplayName({ email: normalizedEmail }),
    }

    persistUser(nextUser)
    setUser(nextUser)
    if(cb) cb()
    return true
  }

  function signout(cb){
    persistUser(null)
    setUser(null)
    if(cb) cb()
  }

  const value = { user, signin, signup, signout, isAuthenticated: !!user, isAdmin: user?.role === 'admin', storageAvailable }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function RequireAuth({ children, redirectTo = '/login', role = 'any' }){
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if(!isAuthenticated) return <Navigate to={redirectTo} state={{ from: location }} replace />
  if (role !== 'any' && user?.role !== role) return <Navigate to={redirectTo} state={{ from: location }} replace />
  return children
}

export default AuthContext
