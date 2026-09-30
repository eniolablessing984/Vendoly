import { formatMoney } from '../data/marketplaceFormat'

const STORAGE_KEY = 'vendor_notifications'

function load(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const savedNotifications = JSON.parse(raw)
    return Array.isArray(savedNotifications)
      ? savedNotifications.filter(item => item && typeof item === 'object' && item.id != null)
      : []
  }catch{ return [] }
}
function save(list){ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(list)) }catch{
  // Notifications can still be returned even when they cannot be persisted.
}
}

export async function sendEmail({ to, subject, body }){
  // simulate network latency
  await new Promise(r => setTimeout(r, 500))
  const list = load()
  const id = Date.now().toString()
  const item = { id, to, subject, body, sentAt: new Date().toISOString() }
  list.push(item)
  save(list)
  return item
}

export async function sendOrderNotification(order){
  if(!order) return null
  const to = order.shipping?.email || 'customer@example.com'
  const subject = `Order received — ${order.id || ''}`
  const body = `Thanks for your order. Order ID: ${order.id || ''}\nTotal: ${formatMoney(order.total, order.currency)}\nItems: ${order.items?.length || 0}`
  return sendEmail({ to, subject, body })
}

export async function sendOnboardingEmail(vendor){
  if(!vendor) return null
  const to = vendor.email
  const subject = `Welcome, ${vendor.name} — Next steps to get started`
  const body = `Hi ${vendor.name},\n\nThanks for registering the store "${vendor.storeName || ''}". Our team will review your submission and you'll receive access details soon.\n\nRegards,\nVendor Platform Team`
  return sendEmail({ to, subject, body })
}

export function getAllNotifications(){ return load() }
