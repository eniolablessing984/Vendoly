import { SAMPLE_PRODUCTS } from './products'

const STORAGE_KEY = 'vendor_products'

function loadProducts(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY)
    if(raw){
      return JSON.parse(raw)
    }
  }catch{
    // Fall back to sample products when browser storage is unavailable or invalid.
  }
  return [...SAMPLE_PRODUCTS]
}

function saveProducts(list){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(list)) }catch{
    // Product changes remain available for the current session.
  }
}

export function getAll(){
  return loadProducts()
}

export function getById(id){
  const list = loadProducts()
  return list.find(p => String(p.id) === String(id))
}

export function create(product){
  const list = loadProducts()
  const id = Date.now().toString()
  const newItem = { ...product, id }
  list.push(newItem)
  saveProducts(list)
  return newItem
}

export function update(id, data){
  const list = loadProducts()
  const next = list.map(p => p.id === id ? { ...p, ...data } : p)
  saveProducts(next)
  return next.find(p => p.id === id)
}

export function remove(id){
  const list = loadProducts()
  const next = list.filter(p => p.id !== id)
  saveProducts(next)
}
