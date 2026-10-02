const STORAGE_KEY = 'vendor_seller_applications'

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase()
}

function loadApplications(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const applications = raw ? JSON.parse(raw) : []
    return Array.isArray(applications) ? applications : []
  } catch {
    return []
  }
}

export function list(){
  return [...loadApplications()].sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0))
}

export function getByEmail(email){
  const normalizedEmail = normalizeEmail(email)
  return list().find(app => normalizeEmail(app.email) === normalizedEmail) || null
}

export function create(application){
  const saved = {
    ...application,
    id: Date.now().toString(),
    status: 'pending_review',
    submittedAt: new Date().toISOString(),
  }
  let persisted = false
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...loadApplications(), saved]))
    persisted = true
  } catch {
    // The registration preview remains usable for this session if browser storage is unavailable.
  }
  return { ...saved, persisted }
}

export function updateStatus(id, status){
  const applications = loadApplications()
  const next = applications.map(application => application.id === id ? { ...application, status, reviewedAt: new Date().toISOString() } : application)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    return true
  } catch {
    return false
  }
}

export function isSellerApproved(email){
  const application = getByEmail(email)
  return Boolean(application && application.status === 'verified')
}

export function isSellerBanned(email){
  const application = getByEmail(email)
  return Boolean(application && application.status === 'banned')
}
