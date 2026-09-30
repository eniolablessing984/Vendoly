const STORAGE_KEY = 'vendor_seller_applications'

function loadApplications(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const applications = raw ? JSON.parse(raw) : []
    return Array.isArray(applications) ? applications : []
  } catch {
    return []
  }
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
