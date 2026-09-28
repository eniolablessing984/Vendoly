import { useState } from 'react'
import Container from '../components/Container'
import * as service from '../data/orderService'

export default function AdminOrders(){
  const [orders, setOrders] = useState(() => service.getAll())
  function load(){ setOrders(service.getAll()) }

  function handleDelete(id){ if(!confirm('Delete order?')) return; service.remove(id); load() }

  return (
    <Container>
      <div className="mx-auto max-w-6xl">
        <div className="mb-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#488367]">Seller workspace</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Orders</h1><p className="mt-1 text-sm text-slate-500">A clear view of your customer orders.</p></div>
        <div className="space-y-3">
          {orders.length === 0 ? <div className="text-sm text-neutral-600">No orders yet.</div> : orders.map(o => (
            <div key={o.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div>
                <div className="font-semibold text-slate-900">Order #{o.id}</div>
                <div className="text-sm text-neutral-600">{o.items?.length || 0} items — ${o.total || '0.00'}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleDelete(o.id)} className="rounded-full border border-red-100 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}
