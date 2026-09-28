import * as orderService from '../data/orderService'

function lastNDays(n){
  const days = []
  const now = new Date()
  for(let i = n-1; i >=0; i--){
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    days.push(d)
  }
  return days
}

export function getSummary(){
  const orders = orderService.getAll() || []
  const totalRevenue = orders.reduce((s,o) => s + (parseFloat(o.total)||0), 0)
  const ordersCount = orders.length
  const avgOrder = ordersCount ? totalRevenue / ordersCount : 0
  return { totalRevenue, ordersCount, avgOrder }
}

export function revenueByLastNDays(n = 7){
  const orders = orderService.getAll() || []
  const days = lastNDays(n)
  const map = days.map(d => ({ date: d, label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), revenue: 0 }))

  orders.forEach(o => {
    const d = new Date(o.createdAt)
    // find index matching same day
    const idx = map.findIndex(m => m.date.getFullYear() === d.getFullYear() && m.date.getMonth() === d.getMonth() && m.date.getDate() === d.getDate())
    if(idx >= 0) map[idx].revenue += parseFloat(o.total) || 0
  })

  return map
}

export function topProducts(limit = 5){
  const orders = orderService.getAll() || []
  const agg = {} // id -> { id, title, qty, revenue }
  orders.forEach(o => {
    (o.items||[]).forEach(it => {
      const id = it.id || it.productId || it.sku || it.title
      if(!agg[id]) agg[id] = { id, title: it.title || 'Unknown', qty: 0, revenue: 0 }
      const q = Number(it.qty || 1)
      const p = parseFloat(it.price) || 0
      agg[id].qty += q
      agg[id].revenue += p * q
    })
  })
  return Object.values(agg).sort((a,b) => b.qty - a.qty).slice(0, limit)
}
