import { useState } from 'react'
import Container from '../components/Container'
import * as orderService from '../data/orderService'
import { useAuth } from '../context/AuthContext'
import { formatMinorMoney, toMinorUnits } from '../data/marketplaceFormat'

const statusLabels = { new: 'New', processing: 'Processing', ready_to_ship: 'Ready to ship', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' }

function sellerItemsTotal(items = []){
  return items.reduce((sum, item) => sum + (item.unitAmountMinor ?? toMinorUnits(item.price)) * (item.qty || item.quantity || 1), 0)
}

function formatOrderDate(value){
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleString()
}

export default function AdminOrders(){
  const { user } = useAuth()
  const [orders, setOrders] = useState(() => orderService.getForSeller(user?.id).reverse())
  const [storageAvailable, setStorageAvailable] = useState(() => orderService.isStorageAvailable())
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  function handleStatusChange(orderId, status){
    setError('')
    setNotice('')
    const result = orderService.updateSellerOrderStatus(orderId, user.id, status)
    if (!result) {
      setError('That status change is not available for this order.')
      return
    }
    setOrders(current => current.map(order => String(order.id) === String(orderId) ? result.order : order))
    setStorageAvailable(result.persisted)
    if (!result.persisted) setNotice('Status updated for this session only. Browser storage is unavailable.')
  }

  return (
    <Container>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#3d725a]">Seller workspace</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Orders</h1><p className="mt-1 text-sm text-slate-500">Orders include only items assigned to {user?.storeName || 'your demo store'}.</p></div>
        <p className="mb-5 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">Demo orders are saved in this browser. Status changes are local and do not notify customers.</p>
        {!storageAvailable && !notice && <p role="alert" className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Browser storage is unavailable. Order history or status changes may only last for this session.</p>}
        {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {notice && <p role="alert" className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{notice}</p>}

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center sm:p-12"><h2 className="font-semibold text-slate-900">No orders for your store yet</h2><p className="mt-2 text-sm text-slate-500">When a customer orders one of your products, its seller order will appear here.</p></div>
        ) : <div className="space-y-4">{orders.map(order => {
          const sellerOrder = order.sellerOrder
          const nextStatuses = orderService.getNextSellerOrderStatuses(sellerOrder.status)
          return <article key={`${order.id}-${sellerOrder.id}`} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
              <div><p className="text-xs font-semibold uppercase tracking-wider text-[#3d725a]">Order #{order.id}</p><h2 className="mt-1 text-lg font-semibold text-slate-900">{order.shipping?.name || 'Customer'}</h2><p className="mt-1 text-sm text-slate-500">{order.shipping?.email || 'No email provided'}{order.shipping?.phone ? ` - ${order.shipping.phone}` : ''}</p><p className="mt-1 text-xs text-slate-500">{[order.shipping?.address, order.shipping?.city, order.shipping?.region, order.shipping?.postal, order.shipping?.country].filter(Boolean).join(', ')}</p></div>
              <div className="sm:text-right"><p className="text-xs text-slate-500">Payment</p><p className="mt-1 text-sm font-medium text-slate-800">{order.payment?.method === 'cod' ? 'Cash on delivery - due' : 'Card - demo paid'}</p><p className="mt-1 text-xs text-slate-500">{formatOrderDate(order.createdAt)}</p></div>
            </div>

            <div className="grid gap-5 pt-4 md:grid-cols-[1fr_auto]">
              <div><h3 className="text-sm font-semibold text-slate-900">Your items</h3><ul className="mt-3 space-y-2">{sellerOrder.items.map(item => <li key={`${item.id}-${item.title}`} className="flex justify-between gap-4 text-sm"><span className="min-w-0 truncate text-slate-700">{item.title} <span className="text-slate-500">x {item.qty || item.quantity || 1}</span></span><span className="shrink-0 tabular-nums text-slate-700">{formatMinorMoney((item.unitAmountMinor ?? toMinorUnits(item.price)) * (item.qty || item.quantity || 1), order.currency)}</span></li>)}</ul><p className="mt-3 border-t border-slate-100 pt-3 text-sm font-semibold text-slate-900">Your item subtotal: {formatMinorMoney(sellerItemsTotal(sellerOrder.items), order.currency)}</p></div>
              <div className="md:min-w-52"><label htmlFor={`status-${sellerOrder.id}`} className="block text-sm font-semibold text-slate-900">Fulfillment status<select id={`status-${sellerOrder.id}`} value={sellerOrder.status} onChange={event => handleStatusChange(order.id, event.target.value)} disabled={!nextStatuses.length} className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#cde4d6] disabled:opacity-70"><option value={sellerOrder.status}>{statusLabels[sellerOrder.status] || sellerOrder.status}</option>{nextStatuses.map(status => <option key={status} value={status}>{statusLabels[status] || status}</option>)}</select><p className="mt-2 text-xs text-slate-500">{nextStatuses.length ? 'Choose the next demo step.' : 'This order is closed.'}</p></label></div>
            </div>
          </article>
        })}</div>}
      </div>
    </Container>
  )
}
