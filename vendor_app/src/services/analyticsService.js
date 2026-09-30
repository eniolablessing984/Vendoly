import * as orderService from '../data/orderService'
import { toMinorUnits } from '../data/marketplaceFormat'

function ordersFor(sellerId){
  return sellerId ? orderService.getForSeller(sellerId) : orderService.getAll()
}

function orderRevenueMinor(order){
  if (order.sellerOrder) {
    return order.sellerOrder.items.reduce((sum, item) => sum + (item.unitAmountMinor ?? toMinorUnits(item.price)) * (item.qty || item.quantity || 1), 0)
  }
  return order.totalMinor ?? toMinorUnits(order.total)
}

function deliveredOrders(orders){
  return orders.filter(order => order.sellerOrder
    ? order.sellerOrder.status === 'delivered'
    : order.status === 'delivered')
}

function lastNDays(n){
  const days = []
  const now = new Date()
  for(let i = n - 1; i >= 0; i--){
    const date = new Date(now)
    date.setDate(now.getDate() - i)
    days.push(date)
  }
  return days
}

export function getSummary(sellerId){
  const orders = ordersFor(sellerId) || []
  const completedOrders = deliveredOrders(orders)
  const totalRevenue = completedOrders.reduce((sum, order) => sum + orderRevenueMinor(order), 0) / 100
  const ordersCount = orders.length
  const avgOrder = completedOrders.length ? totalRevenue / completedOrders.length : 0
  return { totalRevenue, ordersCount, completedOrdersCount: completedOrders.length, avgOrder }
}

export function revenueByLastNDays(n = 7, sellerId){
  const orders = deliveredOrders(ordersFor(sellerId) || [])
  const days = lastNDays(n)
  const map = days.map(date => ({ date, label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), revenue: 0 }))

  orders.forEach(order => {
    const date = new Date(order.sellerOrder?.updatedAt || order.createdAt)
    const index = map.findIndex(day => day.date.getFullYear() === date.getFullYear() && day.date.getMonth() === date.getMonth() && day.date.getDate() === date.getDate())
    if (index >= 0) map[index].revenue += orderRevenueMinor(order) / 100
  })
  return map
}

export function topProducts(limit = 5, sellerId){
  const orders = deliveredOrders(ordersFor(sellerId) || [])
  const aggregate = {}
  orders.forEach(order => {
    const items = order.sellerOrder?.items || order.items || []
    items.forEach(item => {
      const id = item.id || item.productId || item.sku || item.title
      if (!aggregate[id]) aggregate[id] = { id, title: item.title || 'Unknown', qty: 0, revenue: 0 }
      const quantity = Number(item.qty || item.quantity || 1)
      const unitMinor = item.unitAmountMinor ?? toMinorUnits(item.price)
      aggregate[id].qty += quantity
      aggregate[id].revenue += unitMinor * quantity / 100
    })
  })
  return Object.values(aggregate).sort((left, right) => right.qty - left.qty).slice(0, limit)
}
