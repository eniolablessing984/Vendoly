import { SAMPLE_PRODUCTS } from './products'

const STORAGE_KEY = 'vendor_products'
const SAMPLE_PRODUCTS_BY_ID = new Map(SAMPLE_PRODUCTS.map(product => [String(product.id), product]))
let sessionProducts = null
let storageAvailable = null

function loadProducts(){
  if (sessionProducts) return sessionProducts
  let raw
  try{
    raw = localStorage.getItem(STORAGE_KEY)
    storageAvailable = true
  }catch{
    storageAvailable = false
    return [...SAMPLE_PRODUCTS]
  }
  if (raw) {
    try {
      const savedProducts = JSON.parse(raw)
      if (Array.isArray(savedProducts)) {
        return savedProducts
          .filter(product => product && typeof product === 'object' && product.id != null)
          .map(product => {
            const sampleProduct = SAMPLE_PRODUCTS_BY_ID.get(String(product.id))
            return sampleProduct ? { ...product, image: sampleProduct.image } : product
          })
      }
    } catch {
      // Ignore malformed demo data while keeping the storage availability status accurate.
    }
  }
  return [...SAMPLE_PRODUCTS]
}

function saveProducts(list){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    sessionProducts = null
    storageAvailable = true
    return true
  }catch{
    sessionProducts = list
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

export function getAll(){
  return loadProducts()
}

export function getById(id){
  const list = loadProducts()
  return list.find(p => String(p.id) === String(id))
}

export function refreshCartItems(items = []){
  return items.map(item => {
    const currentProduct = getById(item.id)
    return currentProduct
      ? { ...item, ...currentProduct, qty: item.qty, catalogAvailable: true }
      : { ...item, catalogAvailable: false }
  })
}

export function getForSeller(sellerId){
  return loadProducts().filter(product => product.sellerId === sellerId)
}

export function getByIdForSeller(id, sellerId){
  return getForSeller(sellerId).find(product => String(product.id) === String(id))
}

export function create(product, sellerId){
  const list = loadProducts()
  const id = Date.now().toString()
  const newItem = { ...product, id, sellerId }
  list.push(newItem)
  const persisted = saveProducts(list)
  return { product: newItem, persisted }
}

export function update(id, data, sellerId){
  const list = loadProducts()
  const ownedProduct = list.find(p => String(p.id) === String(id) && p.sellerId === sellerId)
  if (!ownedProduct) return undefined
  const next = list.map(p => String(p.id) === String(id) ? { ...p, ...data, sellerId } : p)
  const persisted = saveProducts(next)
  return { product: next.find(p => String(p.id) === String(id)), persisted }
}

export function remove(id, sellerId){
  const list = loadProducts()
  const next = list.filter(p => !(String(p.id) === String(id) && p.sellerId === sellerId))
  if (next.length === list.length) return false
  return { removed: true, persisted: saveProducts(next) }
}
