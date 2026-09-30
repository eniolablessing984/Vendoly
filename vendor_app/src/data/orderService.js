import { toMinorUnits } from './marketplaceFormat'

const STORAGE_KEY = 'vendor_orders'
let sessionOrders = null
let storageAvailable = null
const SELLER_ORDER_TRANSITIONS = {
  new: ['processing', 'cancelled'],
  processing: ['ready_to_ship', 'cancelled'],
  ready_to_ship: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
}

function normalizeItems(items){
  if (!Array.isArray(items)) return []
  return items
    .filter(item => item && typeof item === 'object')
    .map((item, index) => {
      const rawQuantity = Number(item.qty ?? item.quantity ?? 1)
      const quantity = Number.isInteger(rawQuantity) && rawQuantity > 0 ? rawQuantity : 1
      const rawUnitAmount = item.unitAmountMinor
      const unitAmountMinor = rawUnitAmount != null && Number.isFinite(Number(rawUnitAmount))
        ? Math.round(Number(rawUnitAmount))
        : toMinorUnits(item.price)
      return {
        ...item,
        id: item.id ?? item.productId ?? `unknown-${index}`,
        title: typeof item.title === 'string' && item.title.trim() ? item.title : 'Unknown product',
        qty: quantity,
        unitAmountMinor,
      }
    })
}

function load(){
  if (sessionOrders) return sessionOrders
  let raw
  try{
    raw = localStorage.getItem(STORAGE_KEY)
    storageAvailable = true
  }catch{
    storageAvailable = false
    return []
  }
  if (!raw) return []
  try {
    const savedOrders = JSON.parse(raw)
    if (!Array.isArray(savedOrders)) return []
    return savedOrders
      .filter(order => order && typeof order === 'object' && order.id != null)
      .map(order => ({
        ...order,
        items: normalizeItems(order.items),
        sellerOrders: Array.isArray(order.sellerOrders)
          ? order.sellerOrders
            .filter(sellerOrder => sellerOrder && typeof sellerOrder === 'object')
            .map(sellerOrder => ({ ...sellerOrder, items: normalizeItems(sellerOrder.items) }))
          : [],
      }))
  }catch{ return [] }
}

function save(list){
  sessionOrders = list
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    sessionOrders = null
    storageAvailable = true
    return true
  }catch{
    // Keep order changes usable for the current session when storage is unavailable.
    storageAvailable = false
    return false
  }
}

export function isStorageAvailable(){
  if (storageAvailable == null) {
    try {
      localStorage.getItem(STORAGE_KEY)
      storageAvailable = true
    } catch {
      storageAvailable = false
    }
  }
  return storageAvailable
}

export function getAll(){ return load() }

export function getById(id){ return load().find(order => String(order.id) === String(id)) }

export function getForSeller(sellerId){
  return load().flatMap(order => {
    const sellerOrder = order.sellerOrders?.find(entry => entry.sellerId === sellerId)
    return sellerOrder ? [{ ...order, sellerOrder }] : []
  })
}

export function getNextSellerOrderStatuses(status){
  return [...(SELLER_ORDER_TRANSITIONS[status] || [])]
}

export function updateSellerOrderStatus(orderId, sellerId, nextStatus){
  const orders = load()
  const order = orders.find(entry => String(entry.id) === String(orderId))
  const sellerOrder = order?.sellerOrders?.find(entry => entry.sellerId === sellerId)
  if (!sellerOrder || !SELLER_ORDER_TRANSITIONS[sellerOrder.status]?.includes(nextStatus)) return undefined
  sellerOrder.status = nextStatus
  sellerOrder.updatedAt = new Date().toISOString()
  const persisted = save(orders)
  return { order: { ...order, sellerOrder }, persisted }
}

export function create(order){
  const list = load()
  const id = Date.now().toString()
  const groupedItems = new Map()
  for (const orderItem of order.items || []) {
    const sellerId = orderItem.sellerId || 'seller-demo'
    const items = groupedItems.get(sellerId) || []
    items.push(orderItem)
    groupedItems.set(sellerId, items)
  }
  const sellerOrders = [...groupedItems.entries()].map(([sellerId, items]) => ({
    id: `${id}:${sellerId}`,
    sellerId,
    items,
    status: 'new',
    createdAt: new Date().toISOString(),
  }))
  const item = { ...order, id, sellerOrders }
  list.push(item)
  const persisted = save(list)
  return { order: item, persisted }
}

export function remove(id){ const list = load().filter(o => o.id !== id); return save(list) }
