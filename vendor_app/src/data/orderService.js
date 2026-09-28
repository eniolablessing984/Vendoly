const STORAGE_KEY = 'vendor_orders'

function load(){
  try{ const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : [] }catch{ return [] }
}

function save(list){ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(list)) }catch{
  // Keep order changes usable for the current session when storage is unavailable.
} }

export function getAll(){ return load() }

export function create(order){
  const list = load()
  const id = Date.now().toString()
  const item = { ...order, id }
  list.push(item)
  save(list)
  return item
}

export function remove(id){ const list = load().filter(o => o.id !== id); save(list) }
