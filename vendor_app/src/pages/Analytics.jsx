import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Container from '../components/Container'
import { useAuth } from '../context/AuthContext'
import { formatMoney } from '../data/marketplaceFormat'
import { getSummary, revenueByLastNDays, topProducts } from '../services/analyticsService'
import * as orderService from '../data/orderService'

function SmallStat({ label, value }){
  return <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><div className="text-sm text-slate-500">{label}</div><div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</div></div>
}

function RevenueChart({ data }){
  const max = Math.max(...data.map(day => day.revenue), 1)
  const width = 560
  const height = 120
  const barWidth = Math.floor(width / data.length) - 8

  if (!data.some(day => day.revenue > 0)) return <p className="rounded-xl bg-slate-50 p-6 text-sm text-slate-500">No seller-marked delivered orders from your store in the last 7 days.</p>

  return <svg role="img" aria-label="Daily delivered order value for the last seven days" viewBox={`0 0 ${width} ${height}`} className="h-32 w-full">
    {data.map((day, index) => {
      const barHeight = (day.revenue / max) * (height - 30)
      const x = index * (barWidth + 8) + 8
      const y = height - barHeight - 20
      return <g key={day.label}><rect x={x} y={y} width={barWidth} height={barHeight} rx="4" fill="#0f172a" opacity="0.95" /><text x={x + barWidth / 2} y={height - 6} fontSize="10" textAnchor="middle" fill="#475569">{day.label}</text></g>
    })}
  </svg>
}

export default function Analytics(){
  const { user } = useAuth()
  const [storageAvailable] = useState(() => orderService.isStorageAvailable())
  const summary = useMemo(() => getSummary(user?.id), [user?.id])
  const byDay = useMemo(() => revenueByLastNDays(7, user?.id), [user?.id])
  const top = useMemo(() => topProducts(5, user?.id), [user?.id])

  return (
    <Container>
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#3d725a]">Seller workspace</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Store analytics</h1><p className="mt-1 text-sm text-slate-500">A snapshot of {user?.storeName || 'your demo store'} performance.</p></div><Link to="/vendor/orders" className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">View orders</Link></div>

        <p className="mb-5 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">These browser-demo reports include only seller orders assigned to your account. Sales value and top products count seller-marked delivered orders; order count includes all statuses.</p>
        {!storageAvailable && <p role="alert" className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Browser storage is unavailable. Reports may not include order history saved in this browser.</p>}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><SmallStat label="Delivered order value" value={formatMoney(summary.totalRevenue)} /><SmallStat label="Your orders" value={summary.ordersCount} /><SmallStat label="Average delivered order" value={formatMoney(summary.avgOrder)} /></div>

        <section className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"><h2 className="mb-3 text-sm font-semibold text-slate-800">Delivered order value - last 7 days</h2><RevenueChart data={byDay} /></section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"><h2 className="mb-3 text-sm font-semibold text-slate-800">Top products</h2>{top.length ? <ol className="space-y-3">{top.map((product, index) => <li key={product.id} className="flex items-center justify-between gap-4"><div className="flex min-w-0 items-center gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded bg-slate-100 text-slate-600">{index + 1}</span><span className="min-w-0"><span className="block truncate font-medium text-slate-800">{product.title}</span><span className="text-xs text-slate-500">Delivered quantity: {product.qty}</span></span></div><span className="shrink-0 font-semibold">{formatMoney(product.revenue)}</span></li>)}</ol> : <p className="text-sm text-slate-500">Delivered orders from your store will appear here.</p>}</section>
      </div>
    </Container>
  )
}
