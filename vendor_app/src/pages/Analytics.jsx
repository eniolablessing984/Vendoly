import { useMemo } from 'react'
import Container from '../components/Container'
import { getSummary, revenueByLastNDays, topProducts } from '../services/analyticsService'
import { Link } from 'react-router-dom'

function SmallStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</div>
    </div>
  )
}

function RevenueChart({ data }) {
  const max = Math.max(...data.map(d => d.revenue), 1)
  const width = 560
  const height = 120
  const barW = Math.floor(width / data.length) - 8

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32">
      {data.map((d, i) => {
        const h = (d.revenue / max) * (height - 30)
        const x = i * (barW + 8) + 8
        const y = height - h - 20
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={h} rx="4" fill="#0f172a" opacity="0.95" />
            <text x={x + barW / 2} y={height - 6} fontSize="10" textAnchor="middle" fill="#475569">
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default function Analytics() {
  // ✅ Synchronous data → compute once during render, no effect needed
  const summary = useMemo(() => getSummary(), [])
  const byDay   = useMemo(() => revenueByLastNDays(7), [])
  const top     = useMemo(() => topProducts(5), [])

  return (
    <Container>
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#488367]">Seller workspace</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Store analytics</h1><p className="mt-1 text-sm text-slate-500">A snapshot of your recent performance.</p></div>
          <Link to="/vendor/orders" className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">View orders →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SmallStat label="Total Revenue" value={`$${summary.totalRevenue.toFixed(2)}`} />
          <SmallStat label="Orders" value={summary.ordersCount} />
          <SmallStat label="Avg Order" value={`$${summary.avgOrder.toFixed(2)}`} />
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Revenue (last 7 days)</h3>
          <RevenueChart data={byDay} />
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Top products</h3>
          <ol className="space-y-2">
            {top.map((t, idx) => (
              <li key={t.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center text-slate-500">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-medium text-slate-800">{t.title}</div>
                    <div className="text-xs text-slate-500">Qty sold: {t.qty}</div>
                  </div>
                </div>
                <div className="font-semibold">${t.revenue.toFixed(2)}</div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Container>
  )
}
