import Container from '../components/Container'
import { Link } from 'react-router-dom'
import * as productService from '../data/productService'
import * as orderService from '../data/orderService'
import { DashboardIcon, OrdersIcon } from '../components/Icon'
import { useAuth } from '../context/AuthContext'

function StatCard({ label, value, icon, tone }){
  return <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><div className={`grid h-12 w-12 place-items-center rounded-2xl ${tone}`}>{icon}</div><div><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{value}</p></div></div>
}

export default function VendorDashboard(){
  const { user, storageAvailable } = useAuth()
  const products = productService.getForSeller(user?.id)
  const orders = orderService.getForSeller(user?.id)
  const openOrders = orders.filter(order => !['delivered', 'cancelled'].includes(order.sellerOrder.status)).length

  return (
    <Container>
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#3d725a]">Seller workspace</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Good to see you</h1><p className="mt-1 text-sm text-slate-500">Your products and orders are grouped under {user?.email || 'your demo seller account'}.</p></div><Link to="/vendor/products/new" className="rounded-full bg-[#1d5a49] px-5 py-3 text-sm font-semibold text-white hover:bg-[#164638]">Add a product</Link></div>
        {!storageAvailable && <p role="alert" className="mb-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Browser storage is unavailable. Your seller demo sign-in will not survive a refresh.</p>}

        <div className="mb-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Your products" value={products.length} icon={<DashboardIcon />} tone="bg-[#e9f3ed] text-[#28644d]" />
          <StatCard label="Your orders" value={orders.length} icon={<OrdersIcon />} tone="bg-[#f5eee5] text-[#8a6438]" />
          <StatCard label="Open fulfillment" value={openOrders} icon={<span aria-hidden="true" className="text-xl font-bold">{openOrders}</span>} tone="bg-amber-50 text-amber-700" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Link to="/vendor/products" className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-[#c3d9ca] hover:shadow-md"><span className="text-xs font-bold uppercase tracking-wider text-[#3d725a]">Your catalog</span><span className="mt-2 flex items-center justify-between text-lg font-semibold text-slate-900">Manage products <span aria-hidden="true" className="text-[#3d725a] transition group-hover:translate-x-1">-&gt;</span></span><span className="mt-1 block text-sm text-slate-500">Update product details, categories, prices, and stock.</span></Link>
          <Link to="/vendor/orders" className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-[#c3d9ca] hover:shadow-md"><span className="text-xs font-bold uppercase tracking-wider text-[#3d725a]">Customer activity</span><span className="mt-2 flex items-center justify-between text-lg font-semibold text-slate-900">Manage orders <span aria-hidden="true" className="text-[#3d725a] transition group-hover:translate-x-1">-&gt;</span></span><span className="mt-1 block text-sm text-slate-500">Review only the order items assigned to your demo store.</span></Link>
          <Link to="/analytics" className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md md:col-span-2"><span className="text-xs font-bold uppercase tracking-wider text-[#3d725a]">Store performance</span><span className="mt-2 block text-lg font-semibold text-slate-900">View analytics</span><span className="mt-1 block text-sm text-slate-500">Open the current demo reports.</span></Link>
        </div>

        {products.length === 0 && <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-6"><h2 className="font-semibold text-slate-900">Start with your first listing</h2><p className="mt-1 text-sm text-slate-500">Your seller catalog is separate from the marketplace sample products.</p><Link to="/vendor/products/new" className="mt-4 inline-flex rounded-full bg-[#1d5a49] px-5 py-3 text-sm font-semibold text-white hover:bg-[#164638]">Create your first product</Link></div>}
      </div>
    </Container>
  )
}
