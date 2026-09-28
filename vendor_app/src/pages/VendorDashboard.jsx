
import Container from '../components/Container'
import { Link } from 'react-router-dom'
import * as productService from '../data/productService'
import * as orderService from '../data/orderService'
import { DashboardIcon, OrdersIcon } from '../components/Icon'
import { useState } from 'react'

export default function VendorDashboard(){
  const [counts] = useState({
    products: productService.getAll().length,
    orders: orderService.getAll().length,
  })

  return (
    <Container>
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#488367]">Seller workspace</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Good to see you</h1><p className="mt-1 text-sm text-slate-500">Here's what's happening with your store.</p></div><Link to="/vendor/products/new" className="rounded-full bg-[#1d5a49] px-5 py-3 text-sm font-semibold text-white hover:bg-[#164638]">+ Add a product</Link></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e9f3ed] text-[#28644d]"><DashboardIcon /></div>
            <div>
              <div className="text-sm text-slate-500">Products</div>
              <div className="mt-1 font-semibold text-2xl tracking-tight text-slate-900">{counts.products}</div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#f5eee5] text-[#8a6438]"><OrdersIcon /></div>
            <div>
              <div className="text-sm text-slate-500">Orders</div>
              <div className="mt-1 font-semibold text-2xl tracking-tight text-slate-900">{counts.orders}</div>
            </div>
          </div>

          <Link to="/analytics" className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md flex items-center justify-between gap-3">
            <div><div className="text-sm text-slate-500">Store performance</div><div className="mt-1 font-semibold text-slate-900">View analytics</div></div><span className="text-xl text-[#488367]">↗</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/vendor/products" className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:border-[#c3d9ca] hover:shadow-md"><span className="text-xs font-bold uppercase tracking-wider text-[#488367]">Your catalog</span><span className="mt-2 flex items-center justify-between text-lg font-semibold text-slate-900">Manage products <span className="text-[#488367] transition group-hover:translate-x-1">→</span></span><span className="mt-1 block text-sm text-slate-500">Add items and keep listings up to date.</span></Link>
          <Link to="/vendor/orders" className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:border-[#c3d9ca] hover:shadow-md"><span className="text-xs font-bold uppercase tracking-wider text-[#488367]">Customer activity</span><span className="mt-2 flex items-center justify-between text-lg font-semibold text-slate-900">View orders <span className="text-[#488367] transition group-hover:translate-x-1">→</span></span><span className="mt-1 block text-sm text-slate-500">Stay on top of incoming orders.</span></Link>
        </div>
      </div>
    </Container>
  )
}
